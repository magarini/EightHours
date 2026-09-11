      const paragraphs = document.querySelectorAll('.chat p');

      function typeParagraph(paragraph, fullText, onComplete) {
        paragraph.textContent = '';
        paragraph.classList.add('visible', 'is-typing');

        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          paragraph.textContent = fullText.slice(0, currentIndex + 1);
          currentIndex += 1;

          if (currentIndex >= fullText.length) {
            clearInterval(typingInterval);
            paragraph.classList.remove('is-typing');
            onComplete();
          }
        }, 45);
      }

      function startTyping(index) {
        if (index >= paragraphs.length) return;

        const paragraph = paragraphs[index];
        const fullText = paragraph.textContent.trim();

        typeParagraph(paragraph, fullText, () => {
          startTyping(index + 1);
        });
      }

      startTyping(0);