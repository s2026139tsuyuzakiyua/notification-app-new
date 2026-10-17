
import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// HTMLの部品を取得
const title = document.getElementById("title");
const content = document.getElementById("content");
const sendButton = document.getElementById("sendButton");
const message = document.getElementById("message");
const adminNoticeList = document.getElementById("adminNoticeList");

// 通知一覧を表示
async function showAdminNotices() {
  if (!adminNoticeList) return;

  adminNoticeList.textContent = "通知を読み込んでいます...";

  try {
    const noticesRef = collection(db, "notices");
    const snapshot = await getDocs(noticesRef);

    // 新しい通知を先に表示する
    const notices = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data()
    }));

    notices.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() ?? 0;
      const timeB = b.createdAt?.toMillis?.() ?? 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      // 送信時刻がない古い通知は、日付で並べる
      return (b.date || "").localeCompare(a.date || "");
    });

    adminNoticeList.replaceChildren();

    if (notices.length === 0) {
      adminNoticeList.textContent = "現在、お知らせはありません。";
      return;
    }

    notices.forEach((notice) => {
      const noticeElement = document.createElement("div");
      noticeElement.className = "notice";

      const dateElement = document.createElement("p");
      dateElement.className = "date";
      dateElement.textContent = notice.date || "";

      const titleElement = document.createElement("h3");
      titleElement.textContent = notice.title || "タイトルなし";

      const contentElement = document.createElement("p");
      contentElement.textContent = notice.content || "";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";

      deleteButton.addEventListener("click", async () => {
        const confirmed = confirm("この通知を削除しますか？");

        if (!confirmed) return;

        deleteButton.disabled = true;

        try {
          await deleteDoc(doc(db, "notices", notice.id));
          await showAdminNotices();
        } catch (error) {
          console.error("通知の削除エラー:", error);
          alert("通知を削除できませんでした。");
          deleteButton.disabled = false;
        }
      });

      noticeElement.append(
        dateElement,
        titleElement,
        contentElement,
        deleteButton
      );

      adminNoticeList.appendChild(noticeElement);
    });
  } catch (error) {
    console.error("通知の読み込みエラー:", error);
    adminNoticeList.textContent =
      "通知を読み込めませんでした。Firebaseの設定や通信を確認してください。";
  }
}

// 通知を送信
sendButton.addEventListener("click", async () => {
  const titleText = title.value.trim();
  const contentText = content.value.trim();

  if (!titleText || !contentText) {
    message.textContent = "タイトルと内容を入力してください。";
    return;
  }

  sendButton.disabled = true;
  message.textContent = "送信しています...";

  try {
    await addDoc(collection(db, "notices"), {
      title: titleText,
      content: contentText,
      date: new Date().toLocaleDateString("ja-JP"),
      createdAt: serverTimestamp()
    });

    title.value = "";
    content.value = "";
    message.textContent = "お知らせを送信しました！";

    await showAdminNotices();
  } catch (error) {
    console.error("通知の送信エラー:", error);
    message.textContent =
      "送信できませんでした。Firebaseの設定や通信を確認してください。";
  } finally {
    sendButton.disabled = false;
  }
});

// ページを開いたときに通知一覧を表示
showAdminNotices();
