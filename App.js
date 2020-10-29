import React from 'react';
import { ScrollView, View } from 'react-native';
import { Path } from 'react-native-svg';
import { Circle } from 'react-native-svg';
import { TSpan, Text, G } from 'react-native-svg';
import { PieChart, ProgressCircle } from 'react-native-svg-charts';

const amount = 100 / 7;

const data = [
  {
    key: 1,
    amount,
    svg: { fill: '#212120' },
    label: '1',
    completedAt: new Date()
  },
  {
    key: 2,
    amount,
    svg: { fill: '#212120' },
    label: '2',
    completedAt: new Date()
  },
  {
    key: 3,
    amount,
    svg: { fill: '#212120' },
    label: '3',
    completedAt: new Date()
  },
  {
    key: 4,
    amount,
    svg: { fill: '#15ABA6' },
    label: '4'
  },
  {
    key: 5,
    amount,
    svg: { fill: '#DCE0E5' },
    label: '5'
  },
  {
    key: 6,
    amount,
    svg: { fill: '#DCE0E5' },
    label: '6'
  },
  {
    key: 7,
    amount,
    svg: { fill: '#DCE0E5' },
    label: '7'
  }
];

function getQuadrant (x, y) {
  if (x > 0 && y > 0) return 1;
  if (x < 0 && y > 0) return 2;
  if (x < 0 && y < 0) return 3;
  return 4;
}

function toPolarCoordinates (x, y) {
  const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  const angle = Math.atan(y / x);
  const degree = angle * 180 / Math.PI;
  return { hypotenuse, angle, degree };
}

function toCartesianCoordinates (hypotenuse, angle) {
  const x = hypotenuse * Math.cos(angle);
  const y = hypotenuse * Math.sin(angle);
  return [x, y];
}

const Labels = React.memo(({ slices }) => {
  return slices.map((slice, i) => {
    const { labelCentroid: [x, y], data: { label, completedAt } } = slice;
    const { data: { completedAt: previousCompletedAt } } = slices[i - 1] || { data: {} };

    const quadrant = getQuadrant(x, y);
    const polarCoordinates = toPolarCoordinates(x, y);
    const { angle } = polarCoordinates;
    let { hypotenuse } = polarCoordinates;
    hypotenuse += 52;
    let [iconContainerX, iconContainerY] = toCartesianCoordinates(hypotenuse, angle);

    if (quadrant === 2 || quadrant === 3) {
      if (x < 0) iconContainerX = 0 - iconContainerX;
      else iconContainerX = Math.abs(iconContainerX);

      if (y < 0) iconContainerY = 0 - iconContainerY;
      else iconContainerY = Math.abs(iconContainerY);
    }

    const iconRadius = 11;
    const iconX = iconContainerX - (iconRadius / 1.6);
    const iconY = iconContainerY - (iconRadius / 2);

    return (
      <G key={i}>
        <Circle x={iconContainerX} y={iconContainerY} fill="#212120" r={iconRadius} />
        <Path x={iconX} y={iconY} d="M4.50395 9.55896C4.26733 9.52057 4.04388 9.42424 3.85352 9.27855C3.66317 9.13286 3.51181 8.94233 3.41295 8.72396C2.85086 7.66439 2.20339 6.65238 1.47695 5.69796C0.996949 5.07296 0.240949 4.55996 0.687949 4.04896C1.31095 3.33596 2.01295 3.13296 2.65395 3.58096C3.46736 4.23387 4.14885 5.03585 4.66195 5.94396C6.12106 3.68419 8.20564 1.89736 10.6619 0.800957C11.2459 0.542957 12.8869 0.0869572 13.1889 0.479957C13.4399 0.806957 12.8599 1.15996 12.5559 1.39196C9.73325 3.37319 7.37483 5.94418 5.64395 8.92696C5.53795 9.11667 5.38395 9.27519 5.19738 9.38664C5.01082 9.49808 4.79824 9.55854 4.58095 9.56196H4.50395" fill="#15ABA6"/>
        <G x={x} y={y}>
          <Text>
            <TSpan
              fill={
                completedAt
                  ? '#15ABA6'
                  : previousCompletedAt
                  ? '#ffffff'
                  : '#7A858C'
              }
              inlineSize={70}
              textAnchor="middle"
            >
              item {label}
            </TSpan>
          </Text>
        </G>
      </G>
    );
  });
});

function App () {
  return (
    <View style={{ flex: 1, paddingVertical: 32, paddingHorizontal: 22, backgroundColor: 'gray', overflow: 'visible' }}>
      <ProgressCircle
        style={{ height: 300 }}
        strokeWidth={10}
        progress={0.48}
        progressColor="#15ABA6"
      >
        <PieChart
          style={{ height: 260, marginTop: 20, borderWidth: 1, borderColor: '#000' }}
          valueAccessor={({ item }) => item.amount}
          data={data}
          spacing={0}
          innerRadius="45%"
        >
          <Labels />
        </PieChart>
      </ProgressCircle>
    </View>
  );
}

export default React.memo(App);