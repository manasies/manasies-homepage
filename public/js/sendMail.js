//get the form by its id
const form = document.getElementById("contact-form"); 

const formEvent = form.addEventListener("submit", (event) => {
  event.preventDefault();

  let mail = new FormData(form);

  console.log(sendMail(mail));
})

const sendMail = (mail) => {
    fetch("/contact", {
      method: "post",
      body: mail,
  
    }).then((response) => {
        console.log(response);
        if (response.status == '200') {
            alert('Email Successfuly sent to recipient !');
        }
        else
            alert('Error while sending !');
    });
  };