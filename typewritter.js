      const paragraphs = document.querySelectorAll('.chat p');
      const remainingElements = document.querySelectorAll(
        'body > :not(.chat):not(footer):not(script):not(#sketch-holder)'
      );

      remainingElements.forEach((element) => {
        element.style.display = 'none';
      });

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
        if (index >= paragraphs.length) {
          const allParagraphsVisible = Array.from(paragraphs).every(
            (paragraph) =>
              paragraph.classList.contains('visible') &&
              !paragraph.classList.contains('is-typing')
          );

          if (allParagraphsVisible) {
            remainingElements.forEach((element) => {
              element.style.display = '';
            });
            document.body.classList.add('text-complete');
          }
          return;
        }

        const paragraph = paragraphs[index];
        const fullText = paragraph.textContent.trim();

        typeParagraph(paragraph, fullText, () => {
          startTyping(index + 1);
        });
      }

      startTyping(0);