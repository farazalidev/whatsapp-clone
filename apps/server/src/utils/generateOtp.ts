export function generateOtp() {
  // Generate a random number between 10000 and 99999
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;

  // Convert the number to a string
  const randomString = randomNumber.toString();

  return randomString;
}
