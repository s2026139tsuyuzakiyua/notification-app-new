import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const noticeList =
  document.getElementById("noticeList");

const reloadButton =
  document.getElementById("reloadButton");


// =================================
// お知らせを表示
// =================================

async function showNotices() {

  noticeList.innerHTML = "";

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


    if (snapshot.empty) {

      noticeList.innerHTML = `
        <p>現在、お知らせはありません。</p>
      `;

      return;

    }


    snapshot.forEach(function(docData) {

      const notice =
        docData.data();

      const newNotice =
        document.createElement("div");

      newNotice.className =
        "notice";


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

      `;


      noticeList.appendChild(newNotice);

    });


  } catch (error) {

    console.error(error);

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


// 最初に表示

showNotices();