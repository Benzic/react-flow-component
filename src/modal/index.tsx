import React, { useState, useEffect } from 'react';
import './modal.less'
interface IProps {
    title?: string,
    visible?: boolean,
    onCancel?: (e?: any) => void,
    onOk?: (e?: any) => void
}
const ModalFlow: React.FC<IProps> = (({ children, title, visible, onCancel, onOk }) => {
    const [_visible, setVisible] = useState<boolean | undefined>(false)
    useEffect(() => {
        setVisible(visible)
    }, [visible])
    return <>
        {_visible ? <div className="modal_warpper">
            <div className="modal_warpper_box">
                <div className="modal_warpper_header">
                    <div style={{ fontSize: "15px", fontWeight: "bold" }}>{title}</div>
                    <button type="button" onClick={() => {
                        setVisible(false)
                        onCancel && onCancel()
                    }} aria-label="Close" className="modal-warpper-close"><span className="modal-warpper-close-x"><span role="img" aria-label="close" className="anticon anticon-close modal-warpper-close-icon"><svg viewBox="64 64 896 896" focusable="false" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></span></span></button>
                </div>
                <div className="modal_warpper_body">
                    {React.Children.map(children, (item) => {
                        return item
                    })}
                </div>
                <div className="modal_warpper_footer">
                    <button type="button" className="ant-btn" onClick={() => {
                        setVisible(false)
                        onCancel && onCancel()
                    }}><span>取 消</span></button>
                    <button type="button" className="ant-btn ant-btn-primary" style={{ marginLeft: "8px" }} onClick={() => {
                        setVisible(false)
                        onOk && onOk()
                    }}><span>确 定</span></button>
                </div>
            </div>
        </div> : null}
    </>
})
export default ModalFlow