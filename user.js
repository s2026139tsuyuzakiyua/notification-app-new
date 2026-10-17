
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
  noticeList.innerHTML = "<p>お知らせを読み込んでいます...</p>";

  try {
    const noticesRef = collection(db, "notices");
    const snapshot = await getDocs(noticesRef);

    // お知らせがない場合
    if (snapshot.empty) {
      noticeList.innerHTML = "<p>現在、お知らせはありません。</p>";
      return;
    }

    // お知らせを配列にする
    const notices = snapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data()
    }));

    // 送信時刻が新しい順に並べる
    notices.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() ?? 0;
      const timeB = b.createdAt?.toMillis?.() ?? 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      // 送信時刻のない古い通知は日付で並べる
      return (b.date || "").localeCompare(a.date || "");
    });

    // 一覧を空にする
    noticeList.innerHTML = "";

    // お知らせを表示
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

      noticeList.appendChild(newNotice);
    });

  } catch (error) {
    console.error("お知らせの読み込みエラー:", error);

    noticeList.innerHTML =
      "<p>お知らせを読み込めませんでした。時間をおいて再度お試しください。</p>";
  }
}

// 更新ボタンを押したとき
reloadButton.addEventListener("click", showNotices);

// ページを開いたとき
showNotices();
