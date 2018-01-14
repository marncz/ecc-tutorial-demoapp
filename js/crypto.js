window.onload = function() {
  function generateEccKeyPair() {
      var keyPair = sjcl.ecc.elGamal.generateKeys(256);
      var publicKey = keyPair.pub.get();
      var privateKey = keyPair.sec.get();

      var publicKeyHex = sjcl.codec.hex.fromBits(publicKey.x.concat(publicKey.y));
      var privateKeyHex = sjcl.codec.hex.fromBits(privateKey);

      return { public : publicKeyHex, private : privateKeyHex };
  }

  var generateKeysButton = document.getElementById("generateKeysButton");
  generateKeysButton.onclick = function(){
      var keyPair = generateEccKeyPair();
      document.getElementById("privateKey").innerHTML = keyPair.private;
      document.getElementById("publicKey").innerHTML = keyPair.public;

      localStorage.privateKey = keyPair.private;
      localStorage.publicKey = keyPair.public;
  }

  var encryptMessageButton = document.getElementById("encryptMessageButton");
  encryptMessageButton.onclick = function(){

    var plaintext = document.getElementById("toBeEncrypted").value;
    if (localStorage.publicKey === "" || localStorage.privateKey === "") {
      alert("No encryption keys found in localStorage, generate them first.");
      return false;
    }

    var publicKeyObject = new sjcl.ecc.elGamal.publicKey(
        sjcl.ecc.curves.c256,
        sjcl.codec.hex.toBits(localStorage.publicKey)
    );

    var encrypted = sjcl.encrypt(publicKeyObject, plaintext);
    document.getElementById("encryptedMessage").innerHTML = encrypted;
  }

  var decryptMessageButton = document.getElementById("decryptMessageButton");
  decryptMessageButton.onclick = function(){

    var encrypted = document.getElementById("encryptedMessage").innerHTML;
    if (localStorage.publicKey === "" || localStorage.privateKey === "") {
      alert("No encryption keys found in localStorage, generate them first.");
      return false;
    }

    var privateKeyObject = new sjcl.ecc.elGamal.secretKey(
        sjcl.ecc.curves.c256,
        sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.hex.toBits(localStorage.privateKey))
    );

    var decrypted = sjcl.decrypt(privateKeyObject, encrypted.toString());
    console.log(decrypted);
    document.getElementById("decryptedMessage").innerHTML = decrypted;
  }
}
