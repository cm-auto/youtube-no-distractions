"use strict"

export async function select(selector: string, timeoutInMil = 10000): Promise<HTMLElement> {
	const early = document.querySelector(selector)
	if (early) {
		return early as HTMLElement
	}

	return await selectOnlyObserver(selector, timeoutInMil)
}

export async function selectOnlyObserver(selector: string, timeoutInMil = 10000): Promise<HTMLElement> {

	const promise = new Promise<HTMLElement>((resolve, reject) => {

		// declared up here because it needs to be
		// reachable by observer and timeout,
		// however since it also cleans them up
		// it is set at the bottom of this promise
		let cleanupFunction: () => void

		const observer = new MutationObserver(mutationRecords => {
			for (const mutation of mutationRecords) {
				const element = mutation.target as HTMLElement
				if (!element.matches) {
					continue
				}
				if (!element) {
					continue
				}
				if (element.matches(selector)) {
					cleanupFunction()
					resolve(element)
					// keep in mind resolve does not return
					// this return only returns the the callback
					// that is passed to the MutationObserver
					return
				}
			}
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterDataOldValue: false,
		})

		const timeoutId = setTimeout(() => {
			cleanupFunction()
			reject()
		}, timeoutInMil)

		// clean up timeout and unregister from mutation observer
		cleanupFunction = () => {
			clearTimeout(timeoutId)
			observer.disconnect()
		}
	})
	try {
		return await promise
	}
	catch {
		return null
	}

}