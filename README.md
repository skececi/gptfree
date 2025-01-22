# What + Why
The cost of making a GPT wrapper just dropped to zero.

You've heard the following thesis echoed everywhere: “The cost of software is trending to zero.” And then, a subset of that: “GPT Wrappers are adding 0 value”.

I agree… Sort of. The thing is, saying these things outloud or tweeting about them is not what makes cost trend to zero. It’s actually creating the thing and giving it away for free that makes the cost zero.

Let’s say you want to build a ChatGPT clone or integrate LLM Chat into your product.
From my Google searching, several things exist:
- Copies of ChatGPT, but not open source (?) ([\[1\]](https://t3.chat/) [\[2\]](https://chat.thunderlink.me/))
- Paid libraries/starterkits ([\[1\]](https://enhanceui.gumroad.com/l/chatgpt-template-starter-kit), [\[2\]](https://github.com/horizon-ui/chatgpt-ai-template), [\[3\]](https://letsremote.lemonsqueezy.com/buy/8aea640f-0ea4-42c6-a171-8624e59198d4?discount=100))
- Free frontend only UIs (e.g. SillyTavern)
- Free backend only frameworks/libraries

What I cannot find is a very simple way to create a fullstack chatbot starter, batteries included. I’m pretty good at Googling, and I couldn’t find anything. So I figured there’s nothing quite right.

I find a lot of value in **Project Starter Kits**. These are usually GitHub repos that you fork/clone, and then build from as a starting point. They also take the form cmdline solutions like `create-react-app`, `npm create vite@latest`, Django's `startproject`, etc.

Suffice it to say: The goal of this repo is to drive the cost of creating a basic chatbot to zero. You can create a GPT wrapper in ~10 minutes using this repo. Or integrate it into your existing application. Since this is free + MIT licensed— the cost to create a GPT wrapper is now zero. Fork it, host it and charge money, or just copy/paste the code.

Surely this means no one will ever have to do this again ;\) — cue XKCD: https://xkcd.com/927

# Using + Integrating
## Pre-reqs
- `uv` package manager (install with `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- `node/npm`

## Quickstart
1. Fork/clone this repo.
2. Set up `backend`:
   1. `cp .env.sample .env` 
   2. Add your desired API key(s) + which models you want to support. 
   3. Host the backend however you want (see caveats).   
      1. Locally: `cd backend && uv run fastapi dev app.py`
3. Set up `frontend`
   1. `cp .env.sample .env`
   2. Add the URL of your backend server. 
   3. Host the frontend however you want.
   4. Locally: `cd frontend && npm i && npm run dev`


# Notes
* Directly calling the API is generally much cheaper than paying $20/month. 
* CSS wise, I use tailwind and have copied a familiar UI. Customize to your liking.
* Persistence is done via localstorage. You might want to swap this out for account-based DB storage, but since my goal is cleaner integration into your existing system, I am leaving this as an exercise for the implementer.
* Hosting is up to you. If that's a barrier, consider this a good time to learn about hosting simple frontends and backends! I like Vercel and Railway.
  * https://vercel.com/docs/deployments/deployment-methods
  * https://docs.railway.com/quick-start#deploying-your-project---from-github
  * Or run it on the Raspberry Pi in your basement.
* I use `uv` for Python pacmanagement. I'm a big fan so check out [astral.sh](astral.sh).
* I've started with only OpenAI and Anthropic for the models. Sorry Google. As of Jan 2025 your model is still the worst.
* TODOs:
  * support open source + self-hosted models. If that is of interest, do it!
  * streaming.
  * 80/20 of CSS, UX nits.

