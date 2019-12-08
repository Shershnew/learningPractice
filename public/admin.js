window.onload = function () {
  console.log("load", localStorage.getItem('key'));
  document.getElementById('add-article').onclick = () => {
    console.log('add article');
  };

  document.querySelectorAll('.delete-article').forEach((button) => {
    button.onclick = (e) => {
      console.log('del-article', button.name);
      fetch('delete-article-request?title='+button.name);
      location.reload();
    }
  });

  document.querySelectorAll('.delete-friend').forEach((button) => {
    button.onclick = (e) => {
      console.log('del-friend', button.name);
      fetch('delete-friend-request?address='+button.name);
      location.reload();
    }
  });

  document.querySelector('#add-friend').onclick = (e) => {
    const address = document.querySelector('#add-friend-address').value;
    fetch('add-friend?address='+address);
    location.reload();
  };
};
