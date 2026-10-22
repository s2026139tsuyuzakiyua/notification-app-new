

import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// HTMLの部品を取得
const noticeList = document.getElementById("noticeList");
const reloadButton = document.getElementById("reloadButton");

// お知らせを表示
async function showNotices() {
  noticeList.textContent = "お知らせを読み込んでいます...";

  try {
    const noticesRef = collection(db, "notices");
    const snapshot = await getDocs(noticesRef);

    if (snapshot.empty) {
      noticeList.textContent = "現在、お知らせはありません。";
      return;
    }

    // お知らせを配列にする
    const notices = snapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data()
    }));

    // 新しいお知らせを先に表示
    notices.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() ?? 0;
      const timeB = b.createdAt?.toMillis?.() ?? 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      return (b.date || "").localeCompare(a.date || "");
    });

    // 一覧を空にする
    noticeList.replaceChildren();

    // お知らせを1件ずつ表示
    notices.forEach((notice) => {
      const newNotice = document.createElement("div");
      newNotice.className = "notice";

      const dateElement = document.createElement("p");
      dateElement.className = "date";
      dateElement.textContent = notice.date || "";

      const titleElement = document.createElement("h3");
      titleElement.textContent = notice.title || "";

      const contentElement = document.createElement("p");
      contentElement.textContent = notice.content || "";

      newNotice.append(
        dateElement,
        titleElement,
        contentElement
      );

      // 画像URLが保存されている場合に画像を表示
      if (notice.imageUrl) {
        const image = document.createElement("img");

        image.src = notice.imageUrl;
        image.alt = notice.title || "お知らせの画像";
        image.style.display = "block";
        image.style.maxWidth = "100%";
        image.style.height = "auto";
        image.style.marginTop = "10px";
        image.style.borderRadius = "8px";
        image.loading = "lazy";

        // 画像の読み込みに失敗した場合
        image.addEventListener("error", () => {
          image.alt = "画像を読み込めませんでした";
          image.style.display = "none";
          console.error("画像の読み込みに失敗:", notice.imageUrl);
        });

        newNotice.appendChild(image);
      }

      noticeList.appendChild(newNotice);
    });

  } catch (error) {
    console.error("お知らせの読み込みエラー:", error);

    noticeList.textContent =
      "お知らせを読み込めませんでした。時間をおいて再度お試しください。";
  }
}

// 更新ボタン
reloadButton.addEventListener("click", showNotices);

// ページを開いたとき
showNotices();
