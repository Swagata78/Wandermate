// about.js - JS for About page

document.addEventListener('DOMContentLoaded', function() {
    // Example: Animate team members on scroll
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, idx) => {
        member.style.opacity = 0;
        member.style.transform = 'translateY(40px)';
        setTimeout(() => {
            member.style.transition = 'all 0.7s cubic-bezier(.4,2,.3,1)';
            member.style.opacity = 1;
            member.style.transform = 'translateY(0)';
        }, 200 + idx * 150);
    });
});
