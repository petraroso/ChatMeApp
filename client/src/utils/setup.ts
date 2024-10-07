export function getTabId() {
    let tabId = sessionStorage.getItem("tabId");
    let nicknameColorClass = sessionStorage.getItem("textColorClass");
    if (!tabId || !nicknameColorClass) {
      tabId = `tab-${Math.random().toString(36).substring(2, 9)}`;
      nicknameColorClass =
        nicknameColors[Math.floor(Math.random() * nicknameColors.length)];
      sessionStorage.setItem("tabId", tabId);
      sessionStorage.setItem("textColorClass", nicknameColorClass);
    }
    return { tabId, nicknameColorClass };
  }
  
  export function getDocumentTitle() {
    let docTitle = sessionStorage.getItem("documentTitle");
    if (docTitle) {
      document.title = `${docTitle}`;
    } else document.title = `ChatMeApp`;
  }
  
  export const nicknameColors = [
    "text-red-600",
    "text-blue-600",
    "text-green-600",
    "text-yellow-600",
    "text-purple-600",
    "text-pink-600",
    "text-indigo-600",
    "text-teal-600",
  ];