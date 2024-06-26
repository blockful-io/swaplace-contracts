# ✧ Setting up your local environment

### Pre-requisites

* Have [this repository](https://github.com/blockful-io/swaplace-dapp/tree/develop) forked on your environment
* Have [NPM ](https://nodejs.org/en/download/package-manager)or [YARN ](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)installed
* RPC Node ([Alchemy ](https://www.alchemy.com/)or [Infura](https://www.infura.io/))

### Setup

{% hint style="warning" %}
**ATTENTION**

&#x20;After forking the repository, you must change the branch to the `develop` branch to get the latest version.
{% endhint %}

{% hint style="danger" %}
**WARNING**

`main` branch is not stable at the moment.
{% endhint %}

#### Clone the repository

```bash
git clone https://github.com/YourUsername/swaplace-dapp.git
```

then

```bash
git switch develop
```

#### Installing dependencies

{% hint style="info" %}
**NOTE**\
When installing dependencies using YARN or NPM, stick to the selected package manager throughout your project. This consistency helps prevent conflicts and ensures smoother management of dependencies in the future.
{% endhint %}

Run the following commands to install all the dependencies

```bash
 npm i
```

OR

```bash
yarn i
```

After, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

#### Environment Variables

The project comes with a `.env.example` file. You must rename it to `.env` and fill the variables with your values. Most RPC providers offer free testnet nodes. You can use [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) to get a free node. We currently use Sepolia for testing purposes but you can use any other provider and evm chains to test the application.

Alchemy has two types of keys, one for the HTTP provider and another for the Alchemy SDK. You should use the HTTP key for the `NEXT_PUBLIC_ALCHEMY_SEPOLIA_HTTP` variable and the SDK key for the `NEXT_PUBLIC_ALCHEMY_SEPOLIA_KEY` variable.

The HTTP key is used to connect to the blockchain and the SDK key is used to connect to the Alchemy API, which allows us to get the user custody tokens easily.

```
NEXT_PUBLIC_ALCHEMY_SEPOLIA_HTTP=
NEXT_PUBLIC_ALCHEMY_SEPOLIA_KEY=
```

{% hint style="danger" %}
**WARNING**

The `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=` used in the `.env` file is public. They are not meant to be used in production.
{% endhint %}

If you want to use your own please create your Project ID in the [WalletConnect](https://cloud.walletconnect.com/) website (not mandatory).

```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
```

### Contributing

* To know more about how you can contribute [see our notion page](https://blockful.notion.site/Swaplace-Call-for-Contributors-6e4895d2a7264f679439ab2c124603fe).
