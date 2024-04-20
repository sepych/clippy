{
    "targets": [
        {
            "target_name": "addon",
            "sources": [ "src/addon.cc" ],
            "dependencies": [
            "<!(node -p \"require('node-addon-api').gyp\")"
            ],
            "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
            "include_dirs": [
                    "/usr/include/X11",
                    "<!@(node -p \"require('node-addon-api').include\")"
                  ],
            "libraries": [
                "-lX11"
            ],
            "conditions": [
                ['OS=="linux"', {
                  'include_dirs': [
                    "/usr/include/X11"
                  ],
                  'libraries': [
                    "-lX11"
                  ]
                }]
            ]
        }
    ]
}
