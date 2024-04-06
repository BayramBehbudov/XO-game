const playerOption = "✕";
const botOption = "O";
const boxes = Array.from({ length: 9 });

let botPoint = 0;
let playerPoint = 0;

const resetBtn = document.getElementById("resetBtnId")

let winId = [] // qalib gelennoyuncunun secdiyi xanalarin idsini gondereceyik bura

let fullBoxes = []  // hem oyuncu hem botun secidiyi xanalar reqem olaraq 
let playerCards = []  // oyuncunun secdikleri id reqem olaraq bura gelecek
let botCards = [] // botun secdikleri id reqem olaraq bura gelecek

document.querySelector(".game-board").addEventListener("mousedown", (e) => {
  const element = e.target; // istifadecinin hara klik etdiyini goturur

  if (!fullBoxes.includes(+element.id)) { //  istifadecinin klik etdiyi xana dolu olub olmadigini yoxlayiriq

    if (fullBoxes.length <= 9) { // eger xanalar dolu deyilse bu blok ici isleyecek

      element.textContent = playerOption; // istifadeci secen xana x olacaq
      boxes[element.id] = playerOption; // istifadecinin klik etdiyi xananin id-sine uygun olaraq boxes arrayimizin hemin id-ne x elave edirik


      //  bunlarla oyuncunun secdiklerini dolu qutulara ve oyuncunun secdiklerine elave edirik
      fullBoxes.push(+element.id)
      playerCards.push(+element.id)


      // empty boxes = all boxes - full boxes = indexof(empty boxes)
      // burada boxesisi ilk once map edib deyerleri alib sora onu filter edib icinde null olanlari cixaririq ve belelikle emptyboxes bize icinde yalniz reqem qaytarir ve o reqemler bos xanalarin indeksleri olur

      const emptyBoxes = boxes
        .map((box, index) => (box ? null : index))
        .filter((box) => box !== null);


      // bu index deyil, bos qutularin indexini ozunde saxliyan arrayin icinden index goturmek ucundur
      const botRandomNumber = Math.floor(Math.random() * emptyBoxes.length); // burada biz maksimum bos xanalarin icindeki eded sayina beraber reqem alacagiq. minimum ise 0 olacaq

      const botIndex = emptyBoxes[botRandomNumber]; // burada biz bos qutumuzda hansi indeksde olan deyeri gotururuk ki, o deyere beraber olan xanaya muraciet edek, hansi ki xananin id ile burda goturduyumuz deyer beraberdir 

      if (fullBoxes.length <= 8) { // oyunda error vardi deye bunu elave etmisem yeni eger xanada axirinci yeri istifadeci klik etdikde artiq bot oynamasin

        boxes[botIndex] = botOption; // biz axi indeksi goturduk burada artiq boxse arrayin hemin indeksine 0 elave edirik
        document.getElementById(botIndex).textContent = botOption; // ve hemin goturduyumuz indekse uygun xanaya da 0 yaziriq



        // bunlarla botun secdiklerini dolu qutulara ve botun secdiklerine elave edirik
        fullBoxes.push(botIndex)
        botCards.push(botIndex)

      }

      // Her klikde find vinner ile qalib varmi yoxlayiriq
      findWinner()
    }
  } else if (fullBoxes.length >= 9) { // eger istidacenin klik etdiyi xana dolu idise ve fullboxes de doludusa bu blog isleyecek
    reset() // funksiya cagirilacaq sifirlanacaq her sey
    document.getElementById("resultText").textContent = "Butun xanalar doludur.Oyun yeniden basladi"
  } else { // yox eger klik etdiyi xana dolu lakin fullboxes bosdusa bu blok isleyecek
    document.getElementById("resultText").textContent = "Bu xana doludur"
  }

});


// oyuncu ve ya botun secdiklerini artan sira ile duzmeliyik ki kombinasiyada yoxlaya bilek

function artanSiraYaradan(test) {
  var artanSira = test.sort((a, b) => a - b);
  return artanSira;
}

//  bizim kombinasiyamizdaki arraylar 3 eddedlidir. lakin ola biler ki oyuncunun ve ya botun secdikleri 3 ededden cox olsun. ona gore de artan sirali arrayi 3 ededli arraya dondururuk-- bu funksiyani chatGpta yazdirdim)))))

function ucEdedlikKombin(dizi) {
  var kombin = [];
  for (var i = 0; i < dizi.length - 2; i++) {
    for (var j = i + 1; j < dizi.length - 1; j++) {
      for (var k = j + 1; k < dizi.length; k++) {
        kombin.push([dizi[i], dizi[j], dizi[k]]);
      }
    }
  }
  return kombin;
}


// bu funksiya ise qayidan 3lu arraylarin combinasiyada olub olmamasini yoxlayir

function yoxlama(options) {

  const combination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let resultArr = ucEdedlikKombin(artanSiraYaradan(options)) // burada options arqument kimi qebul edilecek biz bura istifadecinin ve ya botun secdiklerini gondereceyik. belelikle birinci artanSiraYaradan funksiyasi onu artan sira ile duzub qaytardigi neticeni ucElemanliKombinasyonlar funksiyasina arqument olaraq gonderecek

  for (i = 0; i < combination.length; i++) {
    for (j = 0; j < resultArr.length; j++) {
      if (resultArr[j].toString() === combination[i].toString()) { //resultArr icindeki 3lu arraylari stringe cevirib combinasiyada yoxlayir varsa true dondurur

        winId = resultArr[j] // qalibin klik etdiyi ve hansiki o xanalar kombinasiyada var onu winId-e oturur

        return true

      }
    }
  }

  return false
}

// bu funksiyada ise qalibi mueyyen edib netice cixaririq

function findWinner() {
  const resultPlayer = yoxlama(playerCards)
  const resultBot = yoxlama(botCards)

  if (resultPlayer) { // eger resultPlayer true olsa bu blok isleyir
    document.getElementById("resultText").textContent = "Siz qalib geldiniz"
    playerPoint++ // oyuncunun xalini artirir
    background() // funksiyani cagirir back deyismek ucun
    reset() // sifirlamaq ucun funksiya cagirir
    document.getElementById("playerPoints").innerText = "Player Score:   " + playerPoint // player xalini yazir
  } else if (resultBot) {
    document.getElementById("resultText").textContent = "Bot qalib geldi"
    botPoint++
    background()
    reset()
    document.getElementById("botPoints").innerText = "Bot Score:   " + botPoint
  } else {
    document.getElementById("resultText").textContent = "Oyun davam edir"
  }
}

// bu funksiya ile oyunu sifirlayiriq

function reset() { // demek olar her seyi sifirlayan funksiyadi
  setTimeout(function () { // reset funksiyasi 1 saniye gecikecek bunu esas backgorundun yasil oldugu gorunsun deye yazdim
    fullBoxes = [];
    playerCards = [];
    botCards = [];
    boxes.fill(null);
    for (let i = 0; i <= 8; i++) {
      document.getElementById(i).textContent = ""; // buyun xanalarin icindeki x ve o silir
    }
    winId.forEach(item => {
      document.getElementById(item).classList.remove("winBack") // qalib xanalarin back deyisir yeni yasili silir
    })
    winId = []
  }, 1000);
}

resetBtn.addEventListener('click', () => { // reset butona klik olanda ise dusur
  document.getElementById("resultText").textContent = "Oyun yeniden basladi"
  reset()
})

function background() {  // qalib xanalarin back rengin yasil edir
  winId.forEach(item => {
    document.getElementById(item).classList.add("winBack")
  })
}
