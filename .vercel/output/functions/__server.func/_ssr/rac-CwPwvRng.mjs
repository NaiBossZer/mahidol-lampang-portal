import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmbeddedSystemView } from "./EmbeddedSystemView-DAUsGX4u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rac-CwPwvRng.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Centralized Configuration Constants
* Single source of truth for all external URLs and configuration
*/
var SUB_SYSTEM_URLS = {
	RAC: "https://mahidol-shellac.vercel.app",
	CLEAN_ENERGY: "https://mahidol-clean-energy.vercel.app",
	SMART_FARM: "https://mahidol-smart-farm.vercel.app/"
};
function RACSystem() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmbeddedSystemView, {
		url: SUB_SYSTEM_URLS.RAC,
		title: "RAC System",
		systemLabel: "Research & Academic Center"
	});
}
//#endregion
export { RACSystem as component };
