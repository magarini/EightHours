const data = [
      { label: "FRIENDS", hours: 21.46, value: 12.70, color: "#F66701" },
      { label: "EXERCISE", hours: 1.98, value: 1.19, color: "#8C96D0" },
      { label: "LOVERS", hours: 13.92, value: 8.28, color: "#E13F31" },
      { label: "REST", hours: 56.00, value: 33.56, color: "#32A04D" },
      { label: "SOLITUDE", hours: 34.65, value: 20.63, color: "#F4B304" },
      { label: "WORK", hours: 40.00, value: 23.81, color: "#4080E7" }
    ];

    const svg = document.querySelector("#chart");
    const doughnut = document.querySelector("#doughnut");
    const info = document.querySelector("#info");

    const center = 200;
    const radius = 145;
    const holeRadius = 82;

    let rotation = 0;
    let startPointerAngle = 0;
    let startRotation = 0;

    function polarToCartesian(angle, radius) {
      const radians = (angle - 90) * Math.PI / 180;

      return {
        x: center + radius * Math.cos(radians),
        y: center + radius * Math.sin(radians)
      };
    }

    function createSlice(startAngle, endAngle, color) {
      const outerStart = polarToCartesian(startAngle, radius);
      const outerEnd = polarToCartesian(endAngle, radius);

      const innerStart = polarToCartesian(endAngle, holeRadius);
      const innerEnd = polarToCartesian(startAngle, holeRadius);

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      const path = [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
        "Z"
      ].join(" ");

      const slice = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      slice.setAttribute("d", path);
      slice.setAttribute("fill", color);
      slice.classList.add("slice");

      return slice;
    }

    function drawChart() {
      let currentAngle = 0;

      data.forEach(item => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + item.value * 3.6;

        const slice = createSlice(
          startAngle,
          endAngle,
          item.color
        );

        doughnut.appendChild(slice);

        item.startAngle = startAngle;
        item.endAngle = endAngle;

        currentAngle = endAngle;
      });

      updateChart();
    }

    function updateChart() {
      doughnut.setAttribute(
        "transform",
        `rotate(${rotation} ${center} ${center})`
      );

      const selectedSlice = getSliceAtMarker();

      info.innerHTML = `
        <strong>${selectedSlice.label}</strong>
        <span>${selectedSlice.hours.toFixed(2)} hours/week</span>
        <span>${selectedSlice.value.toFixed(2)}%</span>
      `;
    }

    function getPointerAngle(event) {
      const point = svg.createSVGPoint();

      point.x = event.clientX;
      point.y = event.clientY;

      const svgPoint = point.matrixTransform(
        svg.getScreenCTM().inverse()
      );

      const x = svgPoint.x - center;
      const y = svgPoint.y - center;

      let angle = Math.atan2(y, x) * 180 / Math.PI + 90;

      if (angle < 0) {
        angle += 360;
      }

      return angle;
    }

    function getSliceAtMarker() {
      /*
        The marker is at 0 degrees.

        Because the chart rotates clockwise, subtract the chart
        rotation to find the original slice angle.
      */
      let angle = (-rotation) % 360;

      if (angle < 0) {
        angle += 360;
      }

      return data.find(item => {
        return angle >= item.startAngle &&
               angle < item.endAngle;
      }) || data[0];
    }

    svg.addEventListener("pointerdown", event => {
      svg.setPointerCapture(event.pointerId);
      svg.classList.add("dragging");

      startPointerAngle = getPointerAngle(event);
      startRotation = rotation;
    });

    svg.addEventListener("pointermove", event => {
      if (!svg.hasPointerCapture(event.pointerId)) {
        return;
      }

      const currentPointerAngle = getPointerAngle(event);
      const angleDifference = currentPointerAngle - startPointerAngle;

      rotation = startRotation + angleDifference;

      updateChart();
    });

    svg.addEventListener("pointerup", event => {
      svg.releasePointerCapture(event.pointerId);
      svg.classList.remove("dragging");
    });

    svg.addEventListener("pointercancel", event => {
      svg.releasePointerCapture(event.pointerId);
      svg.classList.remove("dragging");
    });

    drawChart();