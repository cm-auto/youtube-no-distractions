"use strict"

import { UrlChangeTracker } from "./url-change-tracker"
import { select } from "./selector"

function addMainContentBlockerStyle() {
	// the second selector is for mobile
	document.querySelector("head").innerHTML += `
	<style id="mainContentStyle">
	ytd-rich-grid-renderer.style-scope{display: none;}
	.rich-grid-renderer-contents{display: none;}
	</style>`
}

function addRecommendedBlockerStyle() {
	// the second selector is for mobile
	// it has to be hidden instead of display: none
	// otherwise other scripts will break
	// pointer-events: none should not be necessary
	// but is added to make sure that all browsers
	// ignore clicks on this area
	document.querySelector("head").innerHTML += `
	<style id="recommendedStyle">
		#secondary-inner{visibility:hidden;}
		ytm-item-section-renderer.single-column-watch-next-modern-panels.scwnr-content:nth-of-type(2)
		{
			visibility: hidden;
			pointer-events: none;
		}
	</style>`
}

function removeRecommendedBlockerStyle() {
	const recommendedStyle = document.querySelector("#recommendedStyle")
	if (recommendedStyle) {
		recommendedStyle.remove()
	}
}

if (location.pathname === "/") {
	addMainContentBlockerStyle()
}

// otherwise Fennec and Kiwi will have issues on inital page load
setTimeout(addRecommendedBlockerStyle, 1000)

let showRecommended = false
function toggleShowRecommended() {
	showRecommended = !showRecommended
	showRecommendedSwitch.innerHTML = (showRecommended ? "Hide" : "Show") + " Recommended"
	if (showRecommended) {
		removeRecommendedBlockerStyle()
	}
	else {
		document.querySelector("#recommendedStyle") || addRecommendedBlockerStyle()
	}
}

const showRecommendedSwitch = document.createElement("button")
showRecommendedSwitch.innerHTML = "Show Recommended"
showRecommendedSwitch.addEventListener("click", toggleShowRecommended)
showRecommendedSwitch.style.backgroundColor = "rgba(255,255,255,0.1)"
showRecommendedSwitch.style.color = "white"
showRecommendedSwitch.style.borderRadius = "2em"
showRecommendedSwitch.style.border = "none"
showRecommendedSwitch.style.padding = "10px"
showRecommendedSwitch.style.marginBottom = "10px"
// for mobile
showRecommendedSwitch.style.alignSelf = "center"
async function addShowRecommendedSwitch() {
	const secondaryInnerElement = select("#secondary-inner")
	// mobile needs a delay, otherwise it will be overwritten immediately
	const nextUpElement = new Promise<HTMLElement>(resolve => {
		setTimeout(async () => {
			resolve(await select("ytm-item-section-renderer.single-column-watch-next-modern-panels.scwnr-content:nth-of-type(2)"))
		}, 1000)
	})
	const recommendedElement = await Promise.race([secondaryInnerElement, nextUpElement])
	if (recommendedElement) {
		console.log(recommendedElement.parentElement)
		recommendedElement.parentElement.insertBefore(showRecommendedSwitch, recommendedElement)
	}
}
// otherwise Fennec and Kiwi will have issues on inital page load
setTimeout(addShowRecommendedSwitch, 2000)
// ; (async () => {
// 	await select("ytm-item-section-renderer.single-column-watch-next-modern-panels.scwnr-content:nth-of-type(2)")
// })()


const urlTracker = new UrlChangeTracker()
urlTracker.registerHandler(async (event) => {
	if (event.to.pathname === "/") {
		addMainContentBlockerStyle()
	}
	else {
		// find the style element and if it was found remove it
		const mainContentStyle = document.querySelector("#mainContentStyle")
		if (mainContentStyle) {
			mainContentStyle.remove()
		}
	}

	// otherwise Fennec and Kiwi will not display on inital page load
	setTimeout(addShowRecommendedSwitch, 1000)
})

urlTracker.startTracker()