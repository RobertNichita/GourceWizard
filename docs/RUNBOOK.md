# Secrets Runbook

We chose SOPS because it looked easy to use and fairly transparent. We are able to commit encrypted secrets into Git to be decrypted on the production servers.

## Setup

1. Download SOPS binary from https://github.com/mozilla/sops/releases
2. Get PGP Key `76B3E11B6DE91024052A5C2AE898C550D4164B93` from Ryan. Make sure to `gpg --import pgp-key`

## Encrypting/Opening Encrypted File

```bash
GPG_TTY=$(tty)
export GPG_TTY

EDITOR="code --wait" sops malicious-mallory-cannot-read-this.yml
```

## Decrypting File

```bash
GPG_TTY=$(tty)
export GPG_TTY

sops --decrypt malicious-mallory-cannot-read-this.yml
```

# Setup VM
- Provision Debain VM, t2.medium ($20 USD/month)
- Provision Elastic IP, associate it with VM.
- Create A record
- Download Docker & docker-compose
- Install htop

## SSH

```bash
ssh -i C09-Gource-Ryan.pem admin@gource-wizard.ryan.software 
```

# Installing SOPS

```bash
curl -L https://github.com/mozilla/sops/releases/download/v3.7.2/sops-v3.7.2.linux --output sops
chmod +x sops
```

# Deploy on EC2 VM

```bash
# SSH into VM
GPG_TTY=$(tty)
export GPG_TTY
git pull
sops --decrypt docker-compose-prod.yml > docker-compose.yml
docker-compose down
docker-compose build --no-cache --pull --force-rm
docker-compose up -d
```
