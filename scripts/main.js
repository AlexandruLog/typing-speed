const textField = document.querySelector(".text");
const durationOptions = document.querySelectorAll(".duration-options li");
const changePara = document.querySelector(".change-paragraph");
const typingDetails = document.querySelector(".typing-details");
const listDetails = document.querySelectorAll(".details-list li span");
const inputField = document.querySelector(".input");
const blurInfoPara = document.querySelector(".blur-info");
const resetBtn = document.querySelector("#resetBtn");
const HUNDRED = 100;
const para = [
    "a virtual assistant (typically abbreviated to VA) is generally self-employed and provides professional administrative, technical, or creative assistance to clients remotely from a home office ",
    "closed captions were created for deaf or hard of hearing individuals to assist in comprehension. They can also be used as a tool by those learning to read, learning to speak a non-native language, or in an environment where the audio is difficult to hear or is intentionally muted ",
    "a teacher's professional duties may extend beyond formal teaching. Outside of the classroom teachers may accompany students on field trips, supervise study halls, help with the organization of school functions, and serve as supervisors for extracurricular activities. In some education systems, teachers may have responsibility for student discipline ",
    "business casual is an ambiguously defined dress code that has been adopted by many professional and white-collar workplaces in Western countries. It entails neat yet casual attire and is generally more casual than informal attire but more formal than casual or smart casual attire. Casual Fridays preceded widespread acceptance of business casual attire in many offices ",
    "a paralegal is a person trained in legal matters who performs tasks requiring knowledge of the law and legal procedures. A paralegal is not a lawyer but can be employed by a law office or work freelance at a company or law office. Paralegals are not allowed to offer legal services directly to the public on their own and must perform their legal work under an attorney or law firm ",
    "web designers are expected to have an awareness of usability and if their role involves creating mark up then they are also expected to be up to date with web accessibility guidelines. The different areas of web design include web graphic design, interface design, authoring, including standardised code and proprietary software; user experience design; and search engine optimization ",
    "medical transcription, also known as MT, is an allied health profession dealing with the process of transcribing voice-recorded medical reports that are dictated by physicians, nurses and other healthcare practitioners. Medical reports can be voice files, notes taken during a lecture, or other spoken material. These are dictated over the phone or uploaded digitally via the Internet or through smart phone apps ",
    "engineers, as practitioners of engineering, are people who invent, design, analyze, build, and test machines, systems, structures and materials to fulfill objectives and requirements while considering the limitations imposed by practicality, regulation, safety, and cost. The work of engineers forms the link between scientific discoveries and their subsequent applications to human and business needs and quality of life ",
    "because of the laboriousness of the translation process, since the 1940s efforts have been made, with varying degrees of success, to automate translation or to mechanically aid the human translator. More recently, the rise of the Internet has fostered a world-wide market for translation services and has facilitated language localization. Ideally, the translator must know both languages, as well as the subject that is to be translated ",
];

let runningTimer = false;
let decreaseSecondsInterval;
let secondsLeft;
let duration;
let grossWpm;
let accuracy;
let corectChars = 0;
let incorrectChars = 0;
let totalTypedKeys = 0;

onload = () => {
    setRandomPara();
    setTimerOption();
};

function setRandomPara() {
    textField.textContent = "";
    let randomIndex = Math.floor(Math.random() * para.length);
    para[randomIndex].split("").forEach((letter) => {
        let span = `<span>${letter}</span>`;
        textField.innerHTML += span;
    });

    [textField, blurInfoPara].forEach((element) => {
        element.addEventListener("click", () => {
            inputField.focus();
            textField.style.filter = "blur(0)";
            changePara.style.filter = "blur(0)";
            blurInfoPara.classList.add("hidden");
        });
    });
}

function setTimerOption() {
    for (let option of durationOptions) {
        option.addEventListener("click", () => {
            clearOtherOptions();
            option.classList.add("selected-duration");
        });
    }
}

function clearOtherOptions() {
    for (let option of durationOptions) {
        option.classList.remove("selected-duration");
    }
}

changePara.addEventListener("click", () => {
    setRandomPara();
});

inputField.addEventListener("input", () => {
    if (!runningTimer) {
        startTimer();
        runningTimer = true;
    }
    if (secondsLeft > 0) {
        typing();
        changePara.style.display = "none";
    } else {
        calculateWpm();
        calculateAccuracy();
        textField.classList.add("shake-text-end");
        setTimeout(() => {
            textField.classList.remove("shake-text-end");
        }, 200);
    }
});

function startTimer() {
    let userOption;
    for (let option of durationOptions) {
        if (option.classList.contains("selected-duration")) {
            secondsLeft = parseInt(option.textContent);
            userOption = option;
        }
    }
    if (userOption.textContent === "30") {
        duration = 0.5;
    } else if (userOption.textContent === "60") {
        duration = 1;
    } else {
        duration = 1.5;
    }
   
    decreaseSecondsInterval = setInterval(() => {
        userOption.textContent = --secondsLeft;
        if (secondsLeft === 0) {
            clearInterval(decreaseSecondsInterval);
            userOption.textContent = "Finished";
            typingDetails.classList.remove("hidden");
        }
    }, 1000);
}

let index = 0;

function typing() {
    let characters = document.querySelectorAll(".text span");
    let typedChar = inputField.value[index];

    if (typedChar === undefined) {
        if (characters[index - 1].classList.contains("correct-letter")) {
            --corectChars;
        } else if (characters[index - 1].classList.contains("incorrect-letter")) {
            --incorrectChars;
        }
        characters[--index].classList.remove("correct-letter", "incorrect-letter");
    } else {
        if (characters[index].textContent === typedChar) {
            ++corectChars;
            characters[index++].classList.add("correct-letter");
        } else {
            ++incorrectChars;
            characters[index++].classList.add("incorrect-letter");
        }
    }

    listDetails[2].textContent = ++totalTypedKeys;

    //set i-beam pointer cursor
    clearBeamPointers(characters);
    characters[index].classList.add("i-beam-pointer");

    // Generate new text
    if (index === characters.length - 1) {
        index = 0;
        inputField.value = null;
        setRandomPara();
    }
}

function clearBeamPointers(characters) {
    for (let letter of characters) {
        letter.classList.remove("i-beam-pointer");
    }
}

function calculateWpm() {
    grossWpm = totalTypedKeys / 5 / duration;
    listDetails[0].textContent = Math.floor(grossWpm);
}

function calculateAccuracy() {
    accuracy = (corectChars / totalTypedKeys) * HUNDRED;
    listDetails[1].textContent = accuracy.toFixed(2);
}

resetBtn.addEventListener("click", () => {
    location.reload();
});
