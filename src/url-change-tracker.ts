"use script"

export class UrlChangeEvent extends Event
{
	from: URL
	to: URL
	constructor(from: URL, to: URL)
	{
		super("locationChange")
		this.from = from
		this.to = to
	}
}

export interface UrlChangedHandler
{
	(event: UrlChangeEvent): void
}

export class UrlChangeTracker
{

	#intervalId: number | null = null
	#lastLocationHref: string

	#handlers: Array<UrlChangedHandler> = []

	startTracker()
	{
		this.#lastLocationHref = window.location.href
		this.#intervalId = window.setInterval(async () =>
		{
			const currentLocationHref = window.location.href
			if(currentLocationHref !== this.#lastLocationHref)
			{
				const lastLocationHref = this.#lastLocationHref
				this.#lastLocationHref = currentLocationHref
				
				for(const handler of this.#handlers)
				{
					const lastUrl = new URL(lastLocationHref)
					const currentUrl = new URL(currentLocationHref)
					const event = new UrlChangeEvent(lastUrl, currentUrl)
					await handler(event)
				}
			}
		}, 20)
	}

	registerHandler(handler: UrlChangedHandler)
	{
		this.#handlers.push(handler)
	}
}