import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// HTMLの部品を取得

const noticeList =
  document.getElementById("noticeList");

const reloadButton =
  document.getElementById("reloadButton");


// =================================
// お知らせを表示
// =================================

async function showNotices() {

  noticeList.innerHTML = `
    <p>お知らせを読み込んでいます...</p>
  `;

  try {

    const noticesRef =
      collection(db, "notices");

    const q =
      query(
        noticesRef,
        orderBy("date", "desc")
      );

    const snapshot =
      await getDocs(q);


    // お知らせがない場合

    if (snapshot.empty) {

      noticeList.innerHTML = `
        <p>現在、お知らせはありません。</p>
      `;

      return;

    }


    // お知らせを表示

    noticeList.innerHTML = "";


    snapshot.forEach(function(docData) {

      const notice =
        docData.data();


      const newNotice =
        document.createElement("div");

      newNotice.className =
        "notice";


      newNotice.innerHTML = `

        <p class="date">
          ${notice.date || ""}
        </p>

        <h3>
          ${notice.title || ""}
        </h3>

        <p>
          ${notice.content || ""}
        </p>

      `;


      noticeList.appendChild(newNotice);

    });


  } catch (error) {

    console.error(
      "お知らせの読み込みエラー:",
      error
    );


    noticeList.innerHTML = `
      <p>
        お知らせを読み込めませんでした。
      </p>
    `;

  }

}


// =================================
// 更新ボタン
// =================================

reloadButton.addEventListener(
  "click",
  function() {

    showNotices();

  }
);


// =================================
// ページを開いたときに表示
// =================================

showNotices();
