// Function to handle image selection and update the image source
function updateImage(input, imgElement) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgElement.src = e.target.result; // Update the image src
    };
    reader.readAsDataURL(file); // Convert image to base64 and display it
  }
}

// Get cover image elements
const coverImage = document.getElementById('coverImage');
const coverImageInput = document.getElementById('coverImageInput');

// Get profile image elements
const profileImage = document.getElementById('profileImage');
const profileImageInput = document.getElementById('profileImageInput');

// Event listener for clicking the cover image
coverImage.addEventListener('click', () => {
  coverImageInput.click(); // Trigger hidden file input
});

// Event listener for selecting a new cover image
coverImageInput.addEventListener('change', () => {
  updateImage(coverImageInput, coverImage); // Update cover image source
});

// Event listener for clicking the profile image
profileImage.addEventListener('click', () => {
  profileImageInput.click(); // Trigger hidden file input
});

// Event listener for selecting a new profile image
profileImageInput.addEventListener('change', () => {
  updateImage(profileImageInput, profileImage); // Update profile image source
});


function change_image(image) {
  var container = document.getElementById("main-image");

  container.src = image.src;
}

document.addEventListener("DOMContentLoaded", function (event) {});
