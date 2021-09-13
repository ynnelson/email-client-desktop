import React, { useState, useEffect, useRef, memo } from 'react';
import { Avatar } from 'rsuite';
import CircleLoader from './CircleLoader';
// import { useInterval, usePrevious } from '../../../../../utils/hooks.util';

type Props = {
  parsedSender: string;
  displayLoader: boolean;
  loaderCount: number;
  //   onLoaderCompletion: () => void;
};

const stringToHslColor = require('../../../../utils/avatar.util');

const AvatarLoader = (props: Props) => {
  const { parsedSender, displayLoader, loaderCount } = props;

  let senderArr: any[] = [];

  if (parsedSender) {
    senderArr = parsedSender.split(' ');
  }

  let senderInitials = null;

  if (senderArr.length > 1) {
    senderInitials = `${senderArr[0][0]}${senderArr[1][0]}`.toUpperCase();
  } else {
    // eslint-disable-next-line prefer-destructuring
    senderInitials = senderArr[0][0].toUpperCase();
  }

  return (
    <div className="relative">
      {displayLoader && <CircleLoader loaderCount={loaderCount} />}
      <Avatar
        size="sm"
        className="font-bold"
        style={{
          backgroundColor: stringToHslColor(parsedSender, 45, 65)
        }}
        circle
      >
        {senderInitials}
      </Avatar>
    </div>
  );
};

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.displayLoader === nextProps.displayLoader &&
    prevProps.parsedSender === nextProps.parsedSender
  );
}

export default memo(AvatarLoader, arePropsEqual);