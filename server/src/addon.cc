#include <napi.h>
#include <X11/Xlib.h>
#include <X11/Xatom.h>
#include <iostream>

Display* display;
Window window;
void initX11() {
    display = XOpenDisplay(nullptr);
    window = XCreateSimpleWindow(display, DefaultRootWindow(display), 0, 0, 1, 1, 0, 0, 0);
}

std::string getClipboardText() {
    Atom clipboard = XInternAtom(display, "CLIPBOARD", false);
    Atom target = XInternAtom(display, "UTF8_STRING", false);
    if (target == None) target = XA_STRING;

    XConvertSelection(display, clipboard, target, clipboard, window, CurrentTime);
    XFlush(display);

    XEvent event;
    while (true) {
        XNextEvent(display, &event);
        if (event.type == SelectionNotify) {
            if (event.xselection.selection != clipboard) continue;

            if (event.xselection.property) {
                Atom type;
                int format;
                unsigned long numItems, bytesAfter;
                unsigned char* data = nullptr;
                int result = XGetWindowProperty(display, window, clipboard, 0, ~0L, False, AnyPropertyType,
                                                &type, &format, &numItems, &bytesAfter, &data);
                if (result == Success) {
                    std::string text(reinterpret_cast<char*>(data), numItems);
                    XFree(data);
                    return text;
                }
            }
            break;
        }
    }
    return "";
}

Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  std::string clipboardText = getClipboardText();
  return Napi::String::New(env, clipboardText);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  initX11();
  exports.Set(Napi::String::New(env, "clipboardText"),
              Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(addon, Init)
