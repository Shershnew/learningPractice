async function Password(){
  const value = document.getElementById('password').value;
  await fetch('auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({password: value})
  }).then(data => {
    data.json().then((d) => {
      if(d.authkey){
        localStorage.setItem('key', d.authkey);
        location.replace(`admin?pass=${localStorage.getItem('key')}`);
      } else {
        console.log('error password');
      }
    });
  });
}

window.onload = function () {
  console.log("load");
  document.getElementById('button').onclick = Password;
};
