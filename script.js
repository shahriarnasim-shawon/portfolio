/*==================================================
    PORTFOLIO SCRIPT
    Author : Md Shahriar Nasim Shawon
==================================================*/
"use strict";

/*==================================================
    CONFIGURATION
==================================================*/
const CONFIG = {
    githubUsername: "shahriarnasim-shawon",
    emailJS: {
        publicKey: "kcyDMSYYlayuc4QXX",
        serviceID: "service_0nc8gmr",
        templateID: "template_xla9uii"
    }
};

/*==================================================
    DOM ELEMENTS
==================================================*/
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links li");
const pages = document.querySelectorAll(".page");
const typingElement = document.getElementById("typing");
const backToTop = document.getElementById("backToTop");
const counters = document.querySelectorAll(".stat-card h1");
const visitorCount = document.getElementById("visitor-count");
const footerVisitorCount = document.getElementById("footerVisitorCount");

/*==================================================
    UTILITY
==================================================*/
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}
function random(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}


/*==================================================
    THEME
==================================================*/
function applyTheme(theme){
    if(theme==="dark"){
        document.documentElement.setAttribute("data-theme","dark");
        if(themeToggle) themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';
    }
    else{
        document.documentElement.removeAttribute("data-theme");
        if(themeToggle) themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';
    }
}
const savedTheme=localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if(themeToggle) {
    themeToggle.addEventListener("click",()=>{
        const current=document.documentElement.getAttribute("data-theme")==="dark" ? "dark":"light";
        const next=current==="dark" ? "light":"dark";
        localStorage.setItem("theme",next);
        applyTheme(next);
    });
}

/*==================================================
    MOBILE MENU
==================================================*/
if(menuBtn) {
    menuBtn.addEventListener("click",()=>{
        navLinks.classList.toggle("show");
        menuBtn.classList.toggle("active");
    });

    document.addEventListener("click",(e)=>{
        if(!menuBtn.contains(e.target) && !navLinks.contains(e.target)){
            navLinks.classList.remove("show");
        }
    });
}

/*==================================================
    SINGLE PAGE NAVIGATION
==================================================*/
function showPage(id){
    const target = document.getElementById(id);
    if (target) {
        // Adjusted for the fixed navigation header height (85px)
        const headerOffset = 85; 
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

navItems.forEach(item=>{
    item.addEventListener("click",()=>{
        const page=item.dataset.section;
        showPage(page);
        if(navLinks) navLinks.classList.remove("show");
        setActiveNav(page);
    });
});

/*==================================================
    ACTIVE NAVIGATION
==================================================*/
function setActiveNav(id){
    navItems.forEach(item=>{
        item.classList.remove("active");
        if(item.dataset.section===id){
            item.classList.add("active");
        }
    });
}
setActiveNav("home");

/*==================================================
    FOOTER LINKS
==================================================*/
document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener("click",(e)=>{
        const target=link.getAttribute("href").replace("#","");
        if(target==="") return;
        const page=document.getElementById(target);
        if(page){
            e.preventDefault();
            showPage(target);
            setActiveNav(target);
        }
    });
});

/*==================================================
    TYPING EFFECT
==================================================*/
const typingTexts=[
    "Studying B.Sc in ICE",
    "Computer Vision Researcher",
    "AI & ML Enthusiast",
    "Web Development Enthusiast",
    "Problem Solver",
    "Database Expert",
    "Olympiad Competitor",
    "Content Writing Specialist"
];
let textIndex=0;
let charIndex=0;
let deleting=false;

function typingAnimation(){
    if(!typingElement) return;
    const current=typingTexts[textIndex];
    if(!deleting){
        typingElement.textContent=current.substring(0,charIndex);
        charIndex++;
        if(charIndex>current.length){
            deleting=true;
            setTimeout(typingAnimation,1500);
            return;
        }
    }
    else{
        typingElement.textContent=current.substring(0,charIndex);
        charIndex--;
        if(charIndex<0){
            deleting=false;
            textIndex++;
            if(textIndex>=typingTexts.length){
                textIndex=0;
            }
        }
    }
    setTimeout(typingAnimation, deleting ? 40 : 90);
}
typingAnimation();

/*==================================================
    SCROLL TO TOP
==================================================*/
window.addEventListener("scroll",()=>{
    if(window.scrollY>500){
        if(backToTop) backToTop.style.display="flex";
    }
    else{
        if(backToTop) backToTop.style.display="none";
    }
});
if(backToTop) {
    backToTop.addEventListener("click",()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    });
}

/*==================================================
    COUNTER ANIMATION
==================================================*/
function animateCounter(element){
    const target=parseInt(element.textContent.replace(/\D/g,''));
    if(isNaN(target) || target === 0) return;
    let count=0;
    const speed=target/80;
    const timer=setInterval(()=>{
        count+=speed;
        if(count>=target){
            count=target;
            clearInterval(timer);
        }
        element.textContent=Math.floor(count);
    },20);
}
const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
});
counters.forEach(counter=>{
    observer.observe(counter);
});

/*==================================================
    VISITOR COUNTER (GLOBAL)
==================================================*/
async function updateGlobalVisitorCount() {
    try {
        // We use a free, public API. "shawon-portfolio-2026" acts as your unique database name.
        const response = await fetch('https://api.counterapi.dev/v1/shawon-portfolio-2026/visits/up');
        const data = await response.json();
        
        // Update the HTML with the real global count
        if (visitorCount) {
            visitorCount.textContent = data.count;
        }
        if (footerVisitorCount) {
            footerVisitorCount.textContent = data.count;
        }
    } catch (error) {
        console.error("Counter API failed", error);
        // Fallback just in case the API is ever down
        if (visitorCount) visitorCount.textContent = "1000+";
        if (footerVisitorCount) footerVisitorCount.textContent = "1000+";
    }
}

/*==================================================
    PAGE ANIMATION
==================================================*/
pages.forEach(page=>{
    page.classList.add("fade-up");
});

console.log("%cPortfolio Loaded","color:#4f46e5;font-size:18px;font-weight:bold");


/*==================================================
    AOS & VANILLA TILT
==================================================*/
if (typeof AOS !== "undefined") {
    AOS.init({ duration: 900, easing: "ease-in-out", once: true, mirror: false, offset: 80 });
}

if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(
        document.querySelectorAll(".skill-card, .project-card, .certificate-card, .github-stat-card, .achievement-card"),
        { max: 10, speed: 400, glare: true, "max-glare": 0.15, scale: 1.02 }
    );
}

/*==================================================
    GSAP ANIMATIONS
==================================================*/
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-left", { x: -80, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".hero-right", { x: 80, opacity: 0, duration: 1, delay: .3, ease: "power3.out" });

    document.querySelectorAll(".section-title").forEach(title => {
        gsap.from(title, { scrollTrigger: { trigger: title, start: "top 85%" }, opacity: 0, y: 50, duration: .8 });
    });

    document.querySelectorAll(".project-card,.skill-card,.certificate-card,.achievement-card,.github-stat-card").forEach(card=>{
        gsap.from(card,{ scrollTrigger:{ trigger:card, start:"top 88%" }, opacity:0, y:60, duration:.7 });
    });
}

const profile=document.querySelector(".profile-wrapper");
if(profile && typeof gsap !== "undefined"){
    gsap.to(profile,{ y:18, duration:2, repeat:-1, yoyo:true, ease:"sine.inOut" });
}

if(typeof gsap !== "undefined"){
    document.querySelectorAll(".btn").forEach(btn=>{
        btn.addEventListener("mouseenter",()=> gsap.to(btn,{scale:1.05, duration:.2}) );
        btn.addEventListener("mouseleave",()=> gsap.to(btn,{scale:1, duration:.2}) );
    });

    document.querySelectorAll(".social-icons a,.contact-social a").forEach(icon=>{
        icon.addEventListener("mouseenter",()=> gsap.to(icon,{y:-6, duration:.2}) );
        icon.addEventListener("mouseleave",()=> gsap.to(icon,{y:0, duration:.2}) );
    });
}

document.addEventListener("mousemove",(e)=>{
    const x=(window.innerWidth/2-e.pageX)/45;
    const y=(window.innerHeight/2-e.pageY)/45;
    if(profile && typeof gsap !== "undefined"){
        gsap.to(profile,{x, y, duration:.6});
    }
});

if(typeof gsap !== "undefined"){
    document.querySelectorAll(".skill-card").forEach(card=>{
        card.addEventListener("mouseenter",()=> gsap.to(card,{rotationY:5, duration:.25}) );
        card.addEventListener("mouseleave",()=> gsap.to(card,{rotationY:0, duration:.25}) );
    });

    document.querySelectorAll(".project-image img,.certificate-card img,.research-card img").forEach(img=>{
        img.addEventListener("mouseenter",()=> gsap.to(img,{scale:1.08, duration:.4}) );
        img.addEventListener("mouseleave",()=> gsap.to(img,{scale:1, duration:.4}) );
    });

    document.querySelectorAll(".achievement-icon").forEach(icon=>{
        gsap.to(icon,{ y:8, repeat:-1, yoyo:true, duration:1+Math.random(), ease:"sine.inOut" });
    });
}

/*==================================================
    PARTICLES
==================================================*/
if(typeof particlesJS!=="undefined" && document.getElementById('particles-js')){
    particlesJS("particles-js",{
        particles:{
            number:{ value:70, density:{ enable:true, value_area:900 } },
            color:{ value:"#4f46e5" },
            shape:{ type:"circle" },
            opacity:{ value:.35 },
            size:{ value:3, random:true },
            line_linked:{ enable:true, distance:150, color:"#4f46e5", opacity:.25, width:1 },
            move:{ enable:true, speed:2 }
        },
        interactivity:{
            detect_on:"canvas",
            events:{
                onhover:{ enable:true, mode:"grab" },
                onclick:{ enable:true, mode:"push" }
            },
            modes:{
                grab:{ distance:180 },
                push:{ particles_nb:5 }
            }
        },
        retina_detect:true
    });
}

/*==================================================
    PROJECT FILTER
==================================================*/
const filterButtons=document.querySelectorAll(".filter-btn");
const projectCards=document.querySelectorAll(".project-card");
filterButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        filterButtons.forEach(btn=>btn.classList.remove("active"));
        button.classList.add("active");
        const filter=button.dataset.filter;
        projectCards.forEach(card=>{
            if(filter==="all" || card.classList.contains(filter)){
                card.style.display="block";
                if (typeof gsap !== "undefined") {
                    gsap.fromTo(card, {opacity:0, scale:.8}, {opacity:1, scale:1, duration:.4});
                }
            }
            else{
                card.style.display="none";
            }
        });
    });
});

/*==================================================
    SCROLL PROGRESS BAR
==================================================*/
const progress=document.createElement("div");
progress.id="scrollProgress";
progress.style.position="fixed";
progress.style.top="0";
progress.style.left="0";
progress.style.height="4px";
progress.style.width="0";
progress.style.zIndex="99999";
progress.style.background="linear-gradient(90deg,#4f46e5,#7c3aed)";
document.body.appendChild(progress);
window.addEventListener("scroll",()=>{
    const total=document.documentElement.scrollHeight-window.innerHeight;
    const percent=(window.scrollY/total)*100;
    progress.style.width=percent+"%";
});

/*==================================================
    GITHUB PROFILE & REPOS
==================================================*/
async function loadGithubProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}`);
        if (!response.ok) throw new Error("GitHub profile not found");
        const data = await response.json();
        const avatar = document.getElementById("github-avatar");
        const name = document.getElementById("github-name");
        const bio = document.getElementById("github-bio");
        const repoCount = document.getElementById("repo-count");
        const followers = document.getElementById("followers");
        const following = document.getElementById("following");

        if (avatar) avatar.src = data.avatar_url;
        if (name) name.textContent = data.name || data.login;
        if (bio) bio.textContent = data.bio || "";
        if (repoCount) repoCount.textContent = data.public_repos;
        if (followers) followers.textContent = data.followers;
        if (following) following.textContent = data.following;
    } catch (error) {
        console.error(error);
    }
}

async function loadRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        const container = document.getElementById("repository-grid");
        const latest = document.getElementById("latestRepositories");

        if (!container || !latest) return;
        container.innerHTML = "";
        latest.innerHTML = "";

        // Safe array check for potential API rate limits
        if (Array.isArray(repos)) {
            repos.forEach(repo => {
                const card = document.createElement("div");
                card.className = "project-card";
                card.innerHTML = `
                    <div class="project-content">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || "No description."}</p>
                        <p>⭐ ${repo.stargazers_count}</p>
                        <a href="${repo.html_url}" target="_blank" class="btn">View Repository</a>
                    </div>
                `;
                container.appendChild(card);
                latest.appendChild(card.cloneNode(true));
            });
        }
    } catch (error) {
        console.error(error);
    }
}

if (typeof GitHubCalendar !== "undefined") {
    GitHubCalendar(".calendar", CONFIG.githubUsername, { responsive: true });
}

async function totalStars() {
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}/repos?per_page=100`);
        const repos = await response.json();
        let stars = 0;
        if (Array.isArray(repos)) {
            repos.forEach(repo => { stars += repo.stargazers_count; });
        }
        const starElement = document.getElementById("stars");
        if (starElement) {
            starElement.textContent = stars;
        }
    } catch (error) {
        console.log(error);
    }
}

/*==================================================
    GITHUB EXTRA STATS (Commits, PRs, Issues)
==================================================*/
async function loadGithubExtraStats() {
    try {
        // Fetch Total Issues
        const issuesRes = await fetch(`https://api.github.com/search/issues?q=author:${CONFIG.githubUsername}+type:issue`);
        const issuesData = await issuesRes.json();
        const issueCountEl = document.getElementById("issue-count");
        if (issueCountEl && issuesData.total_count !== undefined) {
            issueCountEl.textContent = issuesData.total_count;
        }

        // Fetch Total Pull Requests
        const prRes = await fetch(`https://api.github.com/search/issues?q=author:${CONFIG.githubUsername}+type:pr`);
        const prData = await prRes.json();
        const prCountEl = document.getElementById("pull-request-count");
        if (prCountEl && prData.total_count !== undefined) {
            prCountEl.textContent = prData.total_count;
        }

        // Fetch Total Commits
        const commitRes = await fetch(`https://api.github.com/search/commits?q=author:${CONFIG.githubUsername}`);
        const commitData = await commitRes.json();
        const commitCountEl = document.getElementById("commit-count");
        if (commitCountEl && commitData.total_count !== undefined) {
            commitCountEl.textContent = commitData.total_count;
        }
    } catch (error) {
        console.error("Failed to load extra GitHub stats", error);
    }
}

/*==================================================
    EMAILJS
==================================================*/
if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: CONFIG.emailJS.publicKey });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        try {
            await emailjs.send(
                CONFIG.emailJS.serviceID,
                CONFIG.emailJS.templateID,
                {
                    name: $("#name").value,
                    email: $("#email").value,
                    subject: $("#subject").value,
                    message: $("#message").value
                }
            );
            alert("Message sent successfully!");
            contactForm.reset();
        } catch {
            alert("Failed to send message.");
        }
    });
}

/*==================================================
    INIT
==================================================*/
window.addEventListener("DOMContentLoaded", () => {
    loadGithubProfile();
    loadRepositories();
    totalStars();
    loadGithubExtraStats();
    updateGlobalVisitorCount();
});

console.log("%cPortfolio Ready 🚀", "color:#4f46e5;font-size:18px;font-weight:bold");