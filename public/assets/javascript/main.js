$(document).ready(function() {
  $("#signin").on('click', function() {
    $.get('/api/users', function(data) {
      console.table(data)
    })
  })
})

