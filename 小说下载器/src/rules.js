/* eslint-disable no-eval */
import { crossPage, gfetch, includeLatestChapter, rm, sleep, convertDomNode } from "./lib";

let rules = new Map([
  ["www.yruan.com", {
    bookname() { return document.querySelector("#info > h1:nth-child(1)").innerText.trim(); },
    author() { return document.querySelector("#info > p:nth-child(2)").innerText.replace(/作\s+者:/, "").trim(); },
    intro() { return convertDomNode(document.querySelector("#intro > p"))[0]; },
    linkList() { return document.querySelectorAll("div.box_con div#list dl dd a"); },
    coverUrl() { return document.querySelector("#fmimg > img").src; },
    chapterName: function (doc) { return doc.querySelector(".bookname > h1:nth-child(1)").innerText.trim(); },
    content: function (doc) { return doc.querySelector("#content"); }
  }],
  ["www.jingcaiyuedu.com", {
    bookname() { return document.querySelector("div.row.text-center.mb10 > h1:nth-child(1)").innerText.trim(); },
    author() { return document.querySelector('div.row.text-center.mb10 a[href^="/novel/"]').innerText.trim(); },
    intro: async () => {
      const indexUrl = document.location.href.replace(/\/list.html$/, ".html");
      return crossPage(indexUrl, "convertDomNode(doc.querySelector('#bookIntro'))[0]");
    },
    linkList() { return document.querySelectorAll("dd.col-md-4 > a"); },
    coverUrl: async () => {
      const indexUrl = document.location.href.replace(/\/list.html$/, ".html");
      return crossPage(indexUrl, "doc.querySelector('.panel-body img').getAttribute('data-original')");
    },
    chapterName: function (doc) { return doc.querySelector("h1.readTitle").innerText.trim(); },
    content: function (doc) {
      let c = doc.querySelector("#htmlContent");
      let ad = c.querySelector("p:nth-child(1)");

      if (ad?.innerText.includes("精彩小说网")) {
        ad.remove();
      }

      return c;
    }
  }],
  ["www.shuquge.com", {
    bookname() { return document.querySelector(".info > h2").innerText.trim(); },
    author() { return document.querySelector(".small > span:nth-child(1)").innerText.replace(/作者：/, "").trim(); },
    intro() {
      let iNode = document.querySelector(".intro");
      iNode.innerHTML = iNode.innerHTML.replace(/推荐地址：http:\/\/www.shuquge.com\/txt\/\d+\/index\.html/, "");
      return convertDomNode(iNode)[0];
    },
    linkList() { return includeLatestChapter(".listmain > dl:nth-child(1)"); },
    coverUrl() { return document.querySelector(".info > .cover > img").src; },
    chapterName: function (doc) { return doc.querySelector(".content > h1:nth-child(1)").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("#content");
      content.innerHTML = content.innerHTML.replace("请记住本书首发域名：www.shuquge.com。书趣阁_笔趣阁手机版阅读网址：m.shuquge.com", "").replace(/http:\/\/www.shuquge.com\/txt\/\d+\/\d+\.html/, "");
      return content;
    }
  }],
  ["www.dingdiann.com", {
    bookname() { return document.querySelector("#info > h1:nth-child(1)").innerText.trim(); },
    author() { return document.querySelector("#info > p:nth-child(2)").innerText.replace(/作\s+者：/, "").trim(); },
    intro() { return convertDomNode(document.querySelector("#intro"))[0]; },
    linkList() { return includeLatestChapter("#list > dl"); },
    coverUrl() { return document.querySelector("#fmimg > img").src; },
    chapterName: function (doc) { return doc.querySelector(".bookname > h1:nth-child(1)").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("#content");
      let ad = '<div align="center"><a href="javascript:postError();" style="text-align:center;color:red;">章节错误,点此举报(免注册)</a>,举报后维护人员会在两分钟内校正章节内容,请耐心等待,并刷新页面。</div>';
      content.innerHTML = content.innerHTML.replace(ad, "").replace(/http:\/\/www.shuquge.com\/txt\/\d+\/\d+\.html/, "");
      return content;
    }
  }],
  ["www.fpzw.com", {
    bookname() { return document.querySelector("#title > h1:nth-child(1)").innerText.trim(); },
    author() { return document.querySelector(".author > a:nth-child(1)").innerText.trim(); },
    intro: async () => {
      const indexUrl = document.location.href.replace(/xiaoshuo\/\d+\//, "");
      const charset = "GBK";
      return crossPage(indexUrl, "convertDomNode(doc.querySelector('.wright .Text'))[0]", charset);
    },
    linkList() { return includeLatestChapter(".book"); },
    coverUrl: async () => {
      const indexUrl = document.location.href.replace(/xiaoshuo\/\d+\//, "");
      const charset = "GBK";
      return crossPage(indexUrl, "doc.querySelector('div.bortable.wleft > img').src", charset);
    },
    chapterName: function (doc) { return doc.querySelector("h2").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector(".Text");
      rm(".Text > a:nth-child(1)", false, content);
      rm('.Text > font[color="#F00"]', false, content);
      rm("strong.top_book", false, content);
      return content;
    },
    charset: "GBK"
  }],
  ["www.hetushu.com", {
    bookname() { return document.querySelector(".book_info > h2").innerText.trim(); },
    author() { return document.querySelector(".book_info > div:nth-child(3) > a:nth-child(1)").innerText.trim(); },
    intro() { return convertDomNode(document.querySelector(".intro"))[0]; },
    linkList() { return document.querySelectorAll("#dir dd a"); },
    coverUrl() { return document.querySelector(".book_info > img").src; },
    chapterName: function (doc) { return doc.querySelector("#content .h2").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("#content");
      rm("h2", true, content);
      return content;
    }
  }],
  ["www.biquwo.org", {
    bookname() { return document.querySelector("#info > h1").innerText.trim(); },
    author() { return document.querySelector("#info > p:nth-child(2)").innerText.replace(/作\s+者：/, "").trim(); },
    intro() { return convertDomNode(document.querySelector("#intro"))[0]; },
    linkList() { return includeLatestChapter("#list > dl:nth-child(1)"); },
    coverUrl() { return document.querySelector("#fmimg > img").src; },
    chapterName: function (doc) { return doc.querySelector(".bookname > h1:nth-child(1)").innerText.trim(); },
    content: function (doc) { return doc.querySelector("#content"); }
  }],
  ["www.xkzw.org", {
    bookname() { return document.querySelector("#info > h1").innerText.trim(); },
    author() { return document.querySelector("#info > p:nth-child(2)").innerText.replace(/作\s+者：/, "").trim(); },
    intro() { return convertDomNode(document.querySelector("#intro"))[0]; },
    linkList() {
      let showmore = document.querySelector("#showMore a");
      let showmoreJS = showmore.href.replace("javascript:", "");

      if (!showmore.innerText.includes("点击关闭")) {
        eval(showmoreJS);
      }

      return document.querySelectorAll(".list dd > a");
    },
    coverUrl() { return document.querySelector("#fmimg > img").src; },
    chapterName: function (doc) { return doc.querySelector(".bookname > h1:nth-child(1)").innerText.trim(); },
    content: async function (doc) {
      runEval(CryptoJS);
      return doc.querySelector("#content");

      function runEval(CryptoJS) {
        function gettt1(str, keyStr, ivStr) {
          let key = CryptoJS.enc.Utf8.parse(keyStr);
          let iv = CryptoJS.enc.Utf8.parse(ivStr);
          let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
          let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
          let decrypt = CryptoJS.DES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
          let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
          return decryptedStr.toString();
        }

        function gettt2(str, keyStr, ivStr) {
          let key = CryptoJS.enc.Utf8.parse(keyStr);
          let iv = CryptoJS.enc.Utf8.parse(ivStr);
          let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
          let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
          let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
          let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
          return decryptedStr.toString();
        }

        function gettt3(str, keyStr, ivStr) {
          let key = CryptoJS.enc.Utf8.parse(keyStr);
          let iv = CryptoJS.enc.Utf8.parse(ivStr);
          let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
          let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
          let decrypt = CryptoJS.RC4.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
          let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
          return decryptedStr.toString();
        }

        function getttn(str, keyStr, ivStr) {
          let key = CryptoJS.enc.Utf8.parse(keyStr);
          let iv = CryptoJS.enc.Utf8.parse(ivStr);
          let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
          let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
          let decrypt = CryptoJS.TripleDES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
          let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
          return decryptedStr.toString();
        }

        function showttt1(doc) {
          let obj = doc.getElementById("other");
          let objTips = doc.getElementById("contenttips");

          if (obj) {
            let content = obj.innerHTML.trim();
            // eslint-disable-next-line radix
            let type = parseInt(content.substring(0, 1));
            let key;
            let iv;

            if (type === 1) {
              key = content.substring(1, 9);
              iv = content.substring(9, 17);
              content = content.substring(17);
              obj.innerHTML = gettt1(content, key, iv);
              obj.style.display = "block";

              if (objTips) {
                objTips.remove();
              }
            } else if (type === 2) {
              key = content.substring(1, 33);
              iv = content.substring(33, 49);
              content = content.substring(49);
              obj.innerHTML = gettt2(content, key, iv);
              obj.style.display = "block";

              if (objTips) {
                objTips.remove();
              }
            } else if (type === 3) {
              key = content.substring(1, 9);
              iv = content.substring(9, 17);
              content = content.substring(17);
              obj.innerHTML = gettt3(content, key, iv);
              obj.style.display = "block";

              if (objTips) {
                objTips.remove();
              }
            } else {
              key = content.substring(1, 25);
              iv = content.substring(25, 33);
              content = content.substring(33);
              obj.innerHTML = getttn(content, key, iv);
              obj.style.display = "block";

              if (objTips) {
                objTips.remove();
              }
            }
          }
        }

        showttt1(doc);
      }
    }
  }],
  ["www.shouda8.com", {
    bookname() { return document.querySelector(".bread-crumbs > li:nth-child(4)").innerText.replace("最新章节列表", "").trim(); },
    author() { return document.querySelector("div.bookname > h1 > em").innerText.replace("作者：", "").trim(); },
    intro() {
      let intro = document.querySelector(".intro");
      rm(".book_keywords");
      rm("script", true);
      rm("#cambrian0");
      return convertDomNode(intro)[0];
    },
    linkList() { return document.querySelectorAll(".link_14 > dl dd a"); },
    coverUrl() { return document.querySelector(".pic > img:nth-child(1)").src; },
    chapterName: function (doc) { return doc.querySelector(".kfyd > h2:nth-child(1)").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("#content");
      rm("p:last-child", false, content);
      return content;
    }
  }],
  ["book.qidian.com", {
    bookname() { return document.querySelector(".book-info > h1 > em").innerText.trim(); },
    author() { return document.querySelector(".book-info .writer").innerText.replace(/作\s+者:/, "").trim(); },
    intro() { return convertDomNode(document.querySelector(".book-info-detail .book-intro"))[0]; },
    linkList: async () => {
      const getLiLength = () => document.querySelectorAll("#j-catalogWrap li").length;
      const getlinkList = () => document.querySelectorAll('.volume-wrap ul.cf li a:not([href^="//vipreader"]');
      return new Promise((resolve, reject) => {
        if (getLiLength() !== 0) {
          resolve(getlinkList());
        } else {
          setTimeout(() => {
            if (getLiLength() !== 0) {
              resolve(getlinkList());
            } else {
              reject(new Error("Can't found linkList."));
            }
          }, 3000);
        }
      });
    },
    coverUrl() { return document.querySelector("#bookImg > img").src; },
    chapterName: function (doc) { return doc.querySelector(".j_chapterName > .content-wrap").innerText.trim(); },
    content: function (doc) { return doc.querySelector(".read-content"); },
    CORS: true
  }],
  ["www.ciweimao.com", {
    bookname() { return document.querySelector(".book-catalog .hd h3").innerText.trim(); },
    author() { return document.querySelector(".book-catalog .hd > p > a").innerText.trim(); },
    intro: async () => {
      const bookid = unsafeWindow.HB.book.book_id;
      const indexUrl = "https://www.ciweimao.com/book/" + bookid;
      return crossPage(indexUrl, "convertDomNode(doc.querySelector('.book-intro-cnt .book-desc'))[0]");
    },
    linkList() {
      document.querySelectorAll(".book-chapter-list > li > a > i").forEach(i => i.parentElement.classList.add("not_download"));
      return document.querySelectorAll(".book-chapter-list > li > a:not(.not_download)");
    },
    coverUrl: async () => {
      const bookid = unsafeWindow.HB.book.book_id;
      const indexUrl = "https://www.ciweimao.com/book/" + bookid;
      return crossPage(indexUrl, "doc.querySelector('.cover > img').src");
    },
    chapterName: function (doc) {
      rm("h3.chapter i", false, doc);
      return doc.querySelector("h3.chapter").innerText.trim();
    },
    content: async function (doc) {
      const url = doc.baseURI;
      const chapter_id = url.split("/").slice(-1)[0];

      let _chapter_author_says = doc.querySelectorAll("#J_BookCnt .chapter.author_say");

      let div_chapter_author_say;

      if (_chapter_author_says.length !== 0) {
        let hr = document.createElement("hr");
        div_chapter_author_say = document.createElement("div");
        div_chapter_author_say.appendChild(hr);

        for (let _chapter_author_say of _chapter_author_says) {
          rm("i", true, _chapter_author_say);
          div_chapter_author_say.appendChild(_chapter_author_say);
        }
      }

      let content = document.createElement("div");
      let decryptDate;

      while (true) {
        if (!window.lock) {
          window.lock = true;
          decryptDate = await chapterDecrypt(chapter_id, url).catch(error => {
            console.error(error);
            chapterDecrypt(chapter_id, url);
          }).catch(error => {
            window.lock = false;
            throw error;
          });
          window.lock = false;
          break;
        } else {
          await sleep(17);
        }
      }

      content.innerHTML = decryptDate;
      rm(".chapter span", true, content);

      if (_chapter_author_says.length !== 0) {
        content.appendChild(div_chapter_author_say);
      }

      return content;

      async function chapterDecrypt(chapter_id, refererUrl) {
        const rootPath = "https://www.ciweimao.com/";
        const access_key_url = rootPath + "chapter/ajax_get_session_code";
        const chapter_content_url = rootPath + "chapter/get_book_chapter_detail_info";
        console.log(`请求 ${access_key_url} Referer ${refererUrl}`);
        const access_key_obj = await gfetch(access_key_url, {
          method: "POST",
          headers: {
            Accept: "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Referer: refererUrl,
            Origin: "https://www.ciweimao.com",
            "X-Requested-With": "XMLHttpRequest"
          },
          data: `chapter_id=${chapter_id}`,
          responseType: "json"
        }).then(response => response.response);
        const chapter_access_key = access_key_obj.chapter_access_key;
        console.log(`请求 ${chapter_content_url} Referer ${refererUrl}`);
        const chapter_content_obj = await gfetch(chapter_content_url, {
          method: "POST",
          headers: {
            Accept: "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Referer: refererUrl,
            Origin: "https://www.ciweimao.com",
            "X-Requested-With": "XMLHttpRequest"
          },
          data: `chapter_id=${chapter_id}&chapter_access_key=${chapter_access_key}`,
          responseType: "json"
        }).then(response => response.response);

        if (chapter_content_obj.code !== 100000) {
          console.error(chapter_content_obj);
          throw new Error(`下载 ${refererUrl} 失败`);
        }

        return decrypt({
          content: chapter_content_obj.chapter_content,
          keys: chapter_content_obj.encryt_keys,
          accessKey: chapter_access_key
        });
      }

      function decrypt(item) {
        let message = item.content;
        let keys = item.keys;
        let len = item.keys.length;
        let accessKey = item.accessKey;
        let accessKeyList = accessKey.split("");
        let charsNotLatinNum = accessKeyList.length;
        let output = new Array();
        output.push(keys[accessKeyList[charsNotLatinNum - 1].charCodeAt(0) % len]);
        output.push(keys[accessKeyList[0].charCodeAt(0) % len]);

        for (let i = 0; i < output.length; i++) {
          message = atob(message);
          let data = output[i];
          let iv = btoa(message.substr(0, 16));
          let keys255 = btoa(message.substr(16));
          let pass = CryptoJS.format.OpenSSL.parse(keys255);
          message = CryptoJS.AES.decrypt(pass, CryptoJS.enc.Base64.parse(data), {
            iv: CryptoJS.enc.Base64.parse(iv),
            format: CryptoJS.format.OpenSSL
          });

          if (i < output.length - 1) {
            message = message.toString(CryptoJS.enc.Base64);
            message = atob(message);
          }
        }

        return message.toString(CryptoJS.enc.Utf8);
      }
    },
    maxConcurrency: 3
  }],
  ["www.jjwxc.net", {
    bookname() { return document.querySelector('h1[itemprop="name"] > span').innerText.trim(); },
    author() { return document.querySelector("td.sptd h2 a span").innerText.trim(); },
    intro() {
      let intro = document.querySelector("#novelintro");
      rm("img", true, intro);
      return convertDomNode(intro)[0];
    },
    linkList() { return document.querySelectorAll('tr[itemprop*="chapter"] > td:nth-child(2) > span a[href]'); },
    coverUrl() { return document.querySelector(".noveldefaultimage").src; },
    chapterName: function (doc) { return doc.querySelector("div.noveltext h2").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("div.noveltext");
      rm("div:first-child", false, content);
      rm('div[style="display:none"]', true, content);
      rm("#favoriteshow_3", false, content);
      rm('div[align="right"]', true, content);
      rm('div[style="clear: both;"]', true, content);
      rm('div[style="width:710px;height:70px;float:right;"]', true, content);
      rm("div.noveltext div.readsmall  > hr", true, content);
      rm("div:first-child", false, content);
      return content;
    },
    charset: "GB18030"
  }],
  ["book.sfacg.com", {
    bookname() { return document.querySelector("h1.story-title").innerText.trim(); },
    author: async () => {
      const indexUrl = document.location.href.replace("/MainIndex/", "");
      return crossPage(indexUrl, "doc.querySelector('.author-name').innerText.trim()");
    },
    intro: async () => {
      const indexUrl = document.location.href.replace("/MainIndex/", "");
      return crossPage(indexUrl, "convertDomNode(doc.querySelector('.introduce'))[0]");
    },
    linkList() {
      return document.querySelectorAll('.catalog-list li a:not([href^="/vip"])');
    },
    coverUrl: async () => {
      const indexUrl = document.location.href.replace("/MainIndex/", "");
      return crossPage(indexUrl, "doc.querySelector('#hasTicket div.pic img').src");
    },
    chapterName: function (doc) { return doc.querySelector("h1.article-title").innerText.trim(); },
    content: function (doc) { return doc.querySelector(".article-content"); }
  }],
  ["www.gebiqu.com", {
    bookname() { return document.querySelector("#info > h1").innerText.trim(); },
    author() { return document.querySelector("#info > p:nth-child(2)").innerText.replace(/作\s+者：/, "").trim(); },
    intro() {
      let intro = document.querySelector("#intro");
      intro.innerHTML = intro.innerHTML.replace(/如果您喜欢.+，别忘记分享给朋友/, "");
      rm('a[href^="http://down.gebiqu.com"]', false, intro);
      return convertDomNode(intro)[0];
    },
    linkList() { return includeLatestChapter("#list > dl:nth-child(1)"); },
    coverUrl() { return document.querySelector("#fmimg > img").src; },
    chapterName: function (doc) { return doc.querySelector(".bookname > h1:nth-child(1)").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("#content");
      content.innerHTML = content.innerHTML.replace("www.gebiqu.com", "");
      return content;
    }
  }],
  ["www.meegoq.com", {
    bookname() { return document.querySelector("article.info > header > h1").innerText.replace(/最新章节$/, "").trim(); },
    author: async () => {
      const indexUrl = document.location.href.replace("/book", "/info");
      return crossPage(indexUrl, "doc.querySelector('article.info > p.detail.pt20 > i:nth-child(1) > a').innerText.trim()");
    },
    intro: async () => {
      const indexUrl = document.location.href.replace("/book", "/info");
      return crossPage(indexUrl, `(() => {
              let intro = doc.querySelector("article.info > p.desc");
              rm('b',false,intro);
              return convertDomNode(intro)[0];
            })()`);
    },
    linkList() {
      let ul = document.querySelector("ul.mulu");
      let rLi = ul.querySelector("li:nth-child(1)");

      if (rLi.innerText.match(/最新.章/)) {
        let p = null;
        let n = rLi;

        while (true) {
          if (n.nodeName === "LI" && n.childElementCount !== 0) {
            p = n;
            n = n.nextSibling;
            p.classList.add("not_download");
          } else if (n.nodeName === "LI" && n.childElementCount === 0 && !n.innerText.match(/最新.章/)) {
            break;
          } else {
            p = n;
            n = n.nextSibling;
          }
        }
      }

      return ul.querySelectorAll("li:not(.not_download) > a");
    },
    coverUrl: async () => {
      const indexUrl = document.location.href.replace("/book", "/info");
      return crossPage(indexUrl, "doc.querySelector('article.info > div.cover > img').src");
    },
    chapterName: function (doc) {
      return doc.querySelector("article > header > h1").innerText.trim();
    },
    content: function (doc) {
      return doc.querySelector("#content");
    },
    maxConcurrency: 1,
    maxRetryTimes: 5
  }],
  ["book.zongheng.com", {
    bookname() { return document.querySelector("div.book-meta > h1").innerText.trim(); },
    author() { return document.querySelector("div.book-meta > p > span:nth-child(1) > a").innerText.trim(); },
    intro: async () => {
      const indexUrl = document.location.href.replace("/showchapter/", "/book/");
      return crossPage(indexUrl, "convertDomNode(doc.querySelector('div.book-info > div.book-dec'))[0]");
    },
    linkList() { return document.querySelectorAll(".chapter-list li:not(.vip) a"); },
    coverUrl: async () => {
      const indexUrl = document.location.href.replace("/showchapter/", "/book/");
      return crossPage(indexUrl, "doc.querySelector('div.book-img > img').src");
    },
    chapterName: function (doc) { return doc.querySelector("div.title_txtbox").innerText.trim(); },
    content: function (doc) { return doc.querySelector("div.content"); }
  }],
  ["www.17k.com", {
    bookname() { return document.querySelector("h1.Title").innerText.trim(); },
    author() { return document.querySelector("div.Author > a").innerText.trim(); },
    intro: async () => {
      const indexUrl = document.location.href.replace("/list/", "/book/");
      return crossPage(indexUrl, "convertDomNode(doc.querySelector('#bookInfo p.intro > a'))[0]");
    },
    linkList() {
      document.querySelectorAll("dl.Volume > dd > a > span.vip").forEach(span => span.parentElement.classList.add("not_download"));
      return document.querySelectorAll("dl.Volume > dd > a:not(.not_download)");
    },
    coverUrl: async () => {
      const indexUrl = document.location.href.replace("/list/", "/book/");
      return crossPage(indexUrl, "doc.querySelector('#bookCover img.book').src.replace('http://','https://')");
    },
    chapterName: function (doc) { return doc.querySelector("#readArea > div.readAreaBox.content > h1").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("#readArea > div.readAreaBox.content > div.p");
      rm('p.copy', false, content);
      rm('#banner_content', false, content);
      rm('div.qrcode', false, content);
      rm('div.chapter_text_ad', false, content);
      return content;
    }
  }],
  ["www.shuhai.com", {
    bookname() { return document.querySelector("div.book-info-bookname > span:nth-child(1)").innerText.trim(); },
    author() { return document.querySelector("div.book-info-bookname > span:nth-child(2)").innerText.replace("作者: ", "").trim(); },
    intro() {
      let intro = document.querySelector("div.book-info-bookintro") || document.querySelector("div.book-info-bookintro-all");
      return convertDomNode(intro)[0];
    },
    linkList: async () => {
      const getLinkList = () => {
        document.querySelectorAll("#muluid div.chapter-item > span.vip")
          .forEach(span => span.parentElement.classList.add("not_download"));
        return document.querySelectorAll("#muluid div.chapter-item:not(.not_download) > a");
      }
      return new Promise((resolve, reject) => {
        if (getLinkList().length !== 0) {
          resolve(getLinkList());
        } else {
          setTimeout(() => {
            if (getLinkList().length !== 0) {
              resolve(getLinkList());
            } else {
              reject(new Error("Can't found linkList."));
            }
          }, 3000);
        }
      });
    },
    coverUrl() { return document.querySelector(".book-cover-wrapper > img").getAttribute("data-original"); },
    chapterName: function (doc) {
      return doc.querySelector("div.chapter-name").innerText.replace("正文 ", "").trim();
    },
    content: function (doc) {
      let content = doc.querySelector("#reader-content > div:nth-child(1)");
      rm("div.chaper-info", false, content);
      return content;
    }
  }],
  ["bianshenbaihe.szalsaf.com", {
    bookname() { return document.querySelector(".book > h1:nth-child(2)").innerText.replace("全文免费阅读", "").trim(); },
    author() { return document.querySelector(".small > span:nth-child(1) > a:nth-child(1)").innerText.trim(); },
    intro: async () => {
      const indexUrl = document.location.href.replace(/\d+\/(\d+\/index\.html)$/, "$1").replace("/index", "");
      return crossPage(indexUrl, "doc.querySelector('.con').innerText.trim()", "GBK");
    },
    linkList() { return document.querySelectorAll(".list > ul:nth-child(2) > li > a") },
    coverUrl: async () => {
      const indexUrl = document.location.href.replace(/\d+\/(\d+\/index\.html)$/, "$1").replace("/index", "");
      return crossPage(indexUrl, "doc.querySelector('#BookImage').src", "GBK");
    },
    chapterName: function (doc) {
      let chapterNameDom = doc.querySelector("#changebgcolor > dl > dt > h1");
      rm("a", false, chapterNameDom);
      rm("span", false, chapterNameDom);
      return chapterNameDom.innerText.replace("《》", "").trim();
    },
    content: async function (doc) {
      const url = doc.baseURI;
      let contents = [];
      let tmpContent;
      let nextPageObj;
      [tmpContent, nextPageObj] = parser(doc);
      contents.push(tmpContent);

      while (nextPageObj.existNextPage) {
        [tmpContent, nextPageObj] = await crossPage(nextPageObj.nextPageUrl, `(${parser.toString()})(doc)`, "GBK");
        contents.push(tmpContent);
      }

      let finContent = document.createElement("div");
      for (let c of contents) {
        finContent.innerHTML = finContent.innerHTML + c.innerHTML.trim();
      }
      return finContent;

      function parser(doc) {
        let content = doc.querySelector("#changebgcolor > dl > dd");

        const nextPage = doc.querySelector(".page > ul:nth-child(1) > li:nth-child(3) > a:nth-child(1)");
        let nextPageObj;
        if (nextPage.href.match(/[\d_]+\.html$/) && nextPage.href.match(/[\d_]+\.html$/)[0].includes("_")) {
          nextPageObj = { existNextPage: true, nextPageUrl: nextPage.href }
        } else {
          nextPageObj = { existNextPage: false, nextPageUrl: null }
        }

        for (let s of [".font", "div[style]", "div.page", "div#wc2"]) {
          content.querySelectorAll(s).length !== 0 && content.querySelectorAll(s).forEach(e => e.remove());
        }
        content.innerHTML = content.innerHTML.replace(`【<a href="http://bianshenbaihe.qinliugan.org">变身百合小说网</a>TXT无弹窗阅读推荐！】`, "");
        return [content, nextPageObj];
      }
    },
    charset: "GBK"
  }],
  ["www.biquge.tw", {
    bookname() { return document.querySelector("#info > h1").innerText.trim(); },
    author() { return document.querySelector("#info > p:nth-child(2)").innerText.replace(/作\s+者：/, "").trim(); },
    intro() { return convertDomNode(document.querySelector("#intro"))[0]; },
    linkList() { return includeLatestChapter("#list > dl:nth-child(1)"); },
    coverUrl() { return document.querySelector("#fmimg > img").src; },
    chapterName: function (doc) { return doc.querySelector(".bookname > h1:nth-child(1)").innerText.trim(); },
    content: function (doc) { return doc.querySelector("#content"); }
  }],
  ["www.uukanshu.com", {
    bookname() { return document.querySelector("dd.jieshao_content > h1 > a").innerText.replace("最新章节", "").trim(); },
    author() { return document.querySelector("dd.jieshao_content > h2 > a").innerText.trim(); },
    intro() {
      let intro = document.querySelector("dd.jieshao_content > h3");
      intro.innerHTML = intro.innerHTML.replace(/^.+简介：\s+www.uukanshu.com\s+/, "").replace(/\s+https:\/\/www.uukanshu.com/, "").replace(/－+/, "")
      return convertDomNode(intro)[0];
    },
    linkList() {
      let button = document.querySelector('span[onclick="javascript:reverse(this);"]');
      const reverse = unsafeWindow.reverse;
      if (button.innerText === "顺序排列") {
        reverse(button);
      }
      return document.querySelectorAll("#chapterList li > a");
    },
    coverUrl() { return document.querySelector("a.bookImg > img").src; },
    chapterName: function (doc) { return doc.querySelector("#timu").innerText.trim(); },
    content: function (doc) {
      let content = doc.querySelector("#contentbox");
      rm(".ad_content", true, content);
      let contentReplace = [
        /[ＵｕUu]+看书\s*[wｗ]+.[ＵｕUu]+[kｋ][aａ][nｎ][ｓs][hｈ][ＵｕUu].[nｎ][eｅ][tｔ]/g,
        /[ＵｕUu]+看书\s*[wｗ]+.[ＵｕUu]+[kｋ][aａ][nｎ][ｓs][hｈ][ＵｕUu].[cＣｃ][oＯｏ][mＭｍ]/g,
        /[UＵ]*看书[（\\(].*?[）\\)]文字首发。/,
        "请记住本书首发域名：。",
        "笔趣阁手机版阅读网址：",
        "小说网手机版阅读网址：",
        "https://",
        "http://",
      ];
      for (let r of contentReplace) {
        content.innerHTML = content.innerHTML.replace(r, "");
      }
      return content;
    },
    charset: "GBK"
  }]
]);


[
  { "mainHost": "book.zongheng.com", "alias": ["huayu.zongheng.com"], "modify": { CORS: true } },
  { "mainHost": "www.shuhai.com", "alias": ["mm.shuhai.com"], "modify": { CORS: true } },
].forEach(entry => {
  const aliases = entry.alias;
  let mainRule = rules.get(entry.mainHost);
  let modify = entry.modify;
  for (let key in modify) {
    if (Object.prototype.hasOwnProperty.call(modify, key)) {
      mainRule[key] = modify[key];
    }
  }
  for (let alias of aliases) {
    rules.set(alias, mainRule);
  }
});

export { rules };
