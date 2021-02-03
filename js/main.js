// main js
(() => {
    
    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentSection = 0; // 현재 활성회된(눈 앞에 보고있는) 섹션(scroll-section)
    let enterNewSection = false; // 새로운 섹션이 시작된 순간 true가 됨

    const sectionInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
                messageB_opacity_in: [0, 1, {start: 0.3, end: 0.4}],
                messageC_opacity_in: [0, 1, {start: 0.5, end: 0.6}],
                messageD_opacity_in: [0, 1, {start: 0.7, end: 0.8}],
                messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
                messageB_translateY_in: [20, 0, {start: 0.3, end: 0.4}],
                messageC_translateY_in: [20, 0, {start: 0.5, end: 0.6}],
                messageD_translateY_in: [20, 0, {start: 0.7, end: 0.8}],
                messageA_scale_in: [1, 1.1, {start: 0.1, end: 0.2}],
                messageB_scale_in: [1, 1.1, {start: 0.3, end: 0.4}],
                messageC_scale_in: [1, 1.1, {start: 0.5, end: 0.6}],
                messageD_scale_in: [1, 1.1, {start: 0.7, end: 0.8}],
                messageA_opacity_out: [1, 0, {start: 0.25, end: 0.3}],
                messageB_opacity_out: [1, 0, {start: 0.45, end: 0.5}],
                messageC_opacity_out: [1, 0, {start: 0.65, end: 0.7}],
                messageD_opacity_out: [1, 0, {start: 0.85, end: 0.9}],
                messageA_translateY_out: [0, -20, {start: 0.25, end: 0.3}],
                messageB_translateY_out: [0, -20, {start: 0.45, end: 0.5}],
                messageC_translateY_out: [0, -20, {start: 0.65, end: 0.7}],
                messageD_translateY_out: [0, -20, {start: 0.85, end: 0.9}]
            }
        },
        {
            // 1
            type: 'normal',
            // heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                canvasCaption: document.querySelector('.canvas-caption')
            }, 
            values: {
                messageA_translateY_in: [20, 0, {start: 0.15, end: 0.2}],
                messageB_translateY_in: [20, 0, {start: 0.4, end: 0.45}],
                messageA_opacity_in: [0, 1, {start: 0.15, end: 0.2}],
                messageB_opacity_in: [0, 1, {start: 0.4, end: 0.45}],
                messageA_translateY_out: [0, -20, {start: 0.3, end: 0.35}],
                messageB_translateY_out: [0, -20, {start: 0.58, end: 0.63}],
                messageA_opacity_out: [1, 0, {start: 0.3, end: 0.35}],
                messageB_opacity_out: [1, 0, {start: 0.58, end: 0.63}]
            }
        }
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sectionInfo.length; i++) {
            if (sectionInfo[i].type === "sticky") {
                sectionInfo[i].scrollHeight = sectionInfo[i].heightNum * window.innerHeight;
            } else {
                // normal
                sectionInfo[i].scrollHeight = sectionInfo[i].objs.container.offsetHeight;
            }
            sectionInfo[i].objs.container.style.height = `${sectionInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sectionInfo.length; i++) {
            totalScrollHeight += sectionInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentSection = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-section-${currentSection}`);
    }

    // currentYOffset : 현재 섹션에서 얼마나 스크롤이 되었는지
    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 섹션에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sectionInfo[currentSection].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;
    }

    function playAnimation() {
        const values = sectionInfo[currentSection].values;
        const objs = sectionInfo[currentSection].objs;
        const currentYOffset = yOffset - prevScrollHeight; // 현재 섹션에서 스크롤된 높이
        const scrollHeight = sectionInfo[currentSection].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        
        switch (currentSection) {
            case 0:
                // console.log('0 play');
                const messageA_scale_in = calcValues(values.messageA_scale_in, currentYOffset);
                const messageB_scale_in = calcValues(values.messageB_scale_in, currentYOffset);
                const messageC_scale_in = calcValues(values.messageC_scale_in, currentYOffset);
                const messageD_scale_in = calcValues(values.messageD_scale_in, currentYOffset);
                
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0) scale(${messageA_scale_in})`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0) scale(${messageA_scale_in})`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0) scale(${messageB_scale_in})`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0) scale(${messageB_scale_in})`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0) scale(${messageC_scale_in})`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0) scale(${messageC_scale_in})`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0) scale(${messageD_scale_in})`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0) scale(${messageD_scale_in})`;
                }

                break;
                
            case 2:
                // console.log('2 play');
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                break;
        }
    }

    function scrollLoop() {
        enterNewSection = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentSection; i++) {
            prevScrollHeight += sectionInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sectionInfo[currentSection].scrollHeight) {
            enterNewSection = true;
            currentSection++;
            document.body.setAttribute('id', `show-section-${currentSection}`);
        }
        
        if (yOffset < prevScrollHeight) {
            enterNewSection = true;
            if (currentSection === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            currentSection--;
            document.body.setAttribute('id', `show-section-${currentSection}`);
        }

        if (enterNewSection) return;

        playAnimation();

    }
    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    // window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);

})();