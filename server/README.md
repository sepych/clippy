# server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Install as a service

Install dependencies:

```bash
npm install -g node-gyp
sudo apt-get install build-essential
sudo apt-get install libx11-dev
```

Build the project:

```bash
bun run single-exe
cp clippy /usr/local/bin/
```

Change YOUR_USER to your user in the `clippy.service` file.

Then run:

```bash
sudo cp clippy.service /etc/systemd/system/
sudo systemctl enable clippy
sudo systemctl start clippy
```
