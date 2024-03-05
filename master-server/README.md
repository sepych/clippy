# master-server

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

Change YOUR_USER to your user in the `master-server.service` file.
Set correct path to the working directory in the `master-server.service` file.

Then run:

```bash
sudo cp master-server.service /etc/systemd/system/
sudo systemctl enable master-server
sudo systemctl start master-server
```
