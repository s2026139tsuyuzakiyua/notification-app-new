import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// HTMLの部品を取得

const title =
  document.getElementById("title");

const content =
  document.getElementById("content");

const sendButton =
  document.getElementById("sendButton");

const message =
  document.getElementById("message");

const adminNoticeList =
  document.getElementById("adminNoticeList");


// =================================
// お知らせを表示
// =================================

async function showAdminNotices() {

  adminNoticeList.innerHTML = "";

  const noticesRef =
    collection(db, "notices");

  const q =
    query(
      noticesRef,
      orderBy("date", "desc")
    );

  const snapshot =
    await getDocs(q);


  snapshot.forEach(function(docData) {

    const notice =
      docData.data();

    const newNotice =
      document.createElement("div");

    newNotice.className = "notice";


    newNotice.innerHTML = `

      <p class="date">
        ${notice.date}
      </p>

      <h3>
        ${notice.title}
      </h3>

      <p>
        ${notice.content}
      </p>

      <button
        class="deleteButton"
        data-id="${docData.id}"
      >
        このお知らせを削除
      </button>

    `;


    adminNoticeList.appendChild(newNotice);

  });


  // 削除ボタン

  const deleteButtons =
    document.querySelectorAll(".deleteButton");


  deleteButtons.forEach(function(button) {

    button.addEventListener(
      "click",
      async function() {

        const id =
          button.dataset.id;


        await deleteDoc(
          doc(db, "notices", id)
        );


        showAdminNotices();

      }
    );

  });

}


// =================================
// お知らせを送信
// =================================

sendButton.addEventListener(
  "click",
  async function() {

    const titleText =
      title.value;

    const contentText =
      content.value;


    if (
      titleText === "" ||
      contentText === ""
    ) {

      message.textContent =
        "タイトルと内容を入力してください。";

      return;

    }


    // Firestoreに保存

    await addDoc(
      collection(db, "notices"),
      {

        title: titleText,

        content: contentText,

        date:
          new Date().toLocaleDateString("ja-JP")

      }
    );


    message.textContent =
      "お知らせを送信しました！";


    title.value = "";

    content.value = "";


    // 一覧を更新

    showAdminNotices();

  }
);


// 最初に表示

showAdminNotices();