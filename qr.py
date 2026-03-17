import qrcode

img = qrcode.make("https://mariethereseandsleiman-weddinginvitation.vercel.app/")
img.save("mariethereseandsleimanqr.png")