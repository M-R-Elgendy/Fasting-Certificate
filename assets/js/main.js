function setUserAgent(window, userAgent) {
    // Works on Firefox, Chrome, Opera and IE9+
    if (navigator.__defineGetter__) {
        navigator.__defineGetter__('userAgent', function () {
            return userAgent;
        });
    } else if (Object.defineProperty) {
        Object.defineProperty(navigator, 'userAgent', {
            get: function () {
                return userAgent;
            }
        });
    }
    // Works on Safari
    if (window.navigator.userAgent !== userAgent) {
        var userAgentProp = {
            get: function () {
                return userAgent;
            }
        };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
}

// set user agent
setUserAgent(window, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");

const {
    degrees,
    PDFDocument,
    rgb,
    StandardFonts
} = PDFLib

async function createCert(heroName) {

    const gender = document.querySelector("#gender").value;
    let url = '';

    if (gender == '1') {
        url = 'assets/certificate/cert.pdf'
    } else {
        url = 'assets/certificate/cert2.pdf'
    }

    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

    const fontUrl = 'assets/fonts/tradbdo.ttf'
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    pdfDoc.registerFontkit(fontkit)
    const customFont = await pdfDoc.embedFont(fontBytes)

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    const {
        width,
        height
    } = firstPage.getSize()



    const textSize = 32;
    const textWidth = customFont.widthOfTextAtSize(heroName, textSize);

    firstPage.drawText(heroName, {
        // cert 1
        x: ((width / 1.85 - textWidth / 2) - 50),
        y: 325,
        size: textSize,
        font: customFont,
        color: PDFLib.rgb(0, 0, 1)
    })

    const pdfBytes = await pdfDoc.save()

    download(pdfBytes, `شهادة ${heroName}.pdf`, "application/pdf");

}

function handelForm() {
    const nameInput = document.querySelector("#hero_name");
    const heroName = nameInput.value;
    if (heroName != '') {
        createCert(heroName);
    } else {
        nameInput.classList.add("border", "border-danger", "text-danger");
        nameInput.setAttribute("placeholder", "الرجاء كتابة اسم البطل")
    }
}