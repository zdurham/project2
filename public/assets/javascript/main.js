// $(document).ready(function() {
//   // Sign in validation
//   var email = $('#email').val().trim()
//   var password = $('#password').val().trim()
//   $("#signin").on('click', function() {
//     if (validator.isEmail(email) && validator.isEmpty($('#password') !== true)) {
//       $.post('/sign-in', {
//         email: email, 
//         password: email
//       },  function() {
//         window.location.href = '/sign-in'
//       })
//     }
//     else if (validator.isEmail(email) !== true) {
//       var err = $('<p class="err">')
//       err.text = 'Please enter a valid email address'
//       err.append($('.title'))
//     }
//     else if (validator.isEmpty(password === true)) {
//       var err = $('<p class="err">')
//       err.text = 'Please enter your password'
//       err.append($('.title'))
//     }
//   })
// })

