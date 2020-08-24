import React from 'react';
import './modal.less';
interface IProps {
    title?: string;
    visible?: boolean;
    onCancel?: (e?: any) => void;
    onOk?: (e?: any) => void;
}
declare const ModalFlow: React.FC<IProps>;
export default ModalFlow;
