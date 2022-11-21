window.addEventListener("load", async () => {
  // check browser
  // if ('serviceWorker' in navigator)
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((res) => {
        console.log(`Success\n`, res);
      })
      .catch((rej) => {
        console.log(`Service worker registration failed\nError: ${rej}`);
      });
  }
  // if (navigator.serviceWorker) {
  //   try {
  //     const sw = await navigator.serviceWorker.register("/sw.js");
  //     console.log(`Success\n`, sw);
  //   } catch (e) {
  //     console.log(`Service worker registration failed\nError: ${e}`);
  //   }
  // }

  await loadPosts();
});

async function loadPosts() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=11"
  );
  const data = await res.json();

  const container = document.querySelector("#posts");
  // TODO: Разобраться
  // container.innerHTML = data.map((post) => toCard(post)).join("\n");
  // same as
  container.innerHTML = data.map(toCard).join("\n");
}

function toCard(post) {
  return `
    <div class="card">
      <div class="card-title">
        ${post.title}
      </div>
      <div class="card-body">
        ${post.body}
      </div>
    </div>
  `;
}
