
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

const imageUploadButton = document.getElementById("imageUploadButton");
const imageUploadMessage = document.getElementById("imageUploadMessage");
const imagePreview = document.getElementById("imagePreview");

// Cloudinaryでアップロードした画像のURL
let uploadedImageUrl = "";

// Cloudinaryの画像アップロード設定
const imageWidget = cloudinary.createUploadWidget(
  {
    cloudName: "m3vaioqa",
    uploadPreset: "notice_images",
    sources: ["local", "camera"],
    multiple: false,
    maxFileSize: 5000000,
    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"]
  },
  (error, result) => {
    if (error) {
      console.error("画像のアップロードエラー:", error);
      imageUploadMessage.textContent =
        "画像をアップロードできませんでした。";
      return;
    }

    if (result && result.event === "success") {
      uploadedImageUrl = result.info.secure_url;

      imagePreview.src = uploadedImageUrl;
      imagePreview.style.display = "block";

      imageUploadMessage.textContent =
        "画像をアップロードしました。";
    }
  }
);

// 画像選択ボタン
imageUploadButton.addEventListener("click", () => {
  imageWidget.open();
});

// 通知一覧を表示
async function showAdminNotices() {
  if (!adminNoticeList) return;

  adminNoticeList.textContent = "通知を読み込んでいます...";

  try {
    const snapshot = await getDocs(collection(db, "notices"));

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

      noticeElement.append(dateElement, titleElement, contentElement);

      // 画像がある通知だけ画像を表示
      if (notice.imageUrl) {
        const image = document.createElement("img");
        image.src = notice.imageUrl;
        image.alt = notice.title || "お知らせの画像";
        image.style.maxWidth = "100%";
        image.style.height = "auto";
        image.loading = "lazy";
        noticeElement.appendChild(image);
      }

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";

      deleteButton.addEventListener("click", async () => {
        if (!confirm("この通知を削除しますか？")) return;

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

      noticeElement.appendChild(deleteButton);
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
      createdAt: serverTimestamp(),
      imageUrl: uploadedImageUrl
    });

    title.value = "";
    content.value = "";
    uploadedImageUrl = "";

    imagePreview.removeAttribute("src");
    imagePreview.style.display = "none";
    imageUploadMessage.textContent = "";

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
