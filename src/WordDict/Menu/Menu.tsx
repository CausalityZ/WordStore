import {ipcRenderer} from 'electron';
import React from 'react';
import {wordData} from '../Sidebar/SidebarAddWord';
import {tagData} from '../Sidebar/SidebarAddTag';
import open from 'open'

interface MenuItem {
    label : string;
    onClick : () => void;
}

type Props = {
    wordData: wordData[];
    setWordData: (data : wordData[]) => void;
    tagData: tagData[];
    setTagData: (data : tagData[]) => void;
    setCurrentPage: (page : number) => void;
}

export const Menu : React.FC < Props > = (props : Props) => {
    const menuItems : MenuItem[] = [
        {
            label: '保存到本地文件',
            onClick: async() => {
                const dataToSave = {
                    words: props.wordData,
                    tags: props.tagData
                };

                await ipcRenderer.invoke('save-data', dataToSave);
            }
        }, {
            label: '读取本地文件',
            onClick: async() => {
                const data = await ipcRenderer.invoke('load-data');
                if (data) {
                    props.setWordData(data.words);
                    props.setTagData(data.tags);
                    props.setCurrentPage(1);
                }
            }
        }
    ];

    return (
        <nav
            className="navbar is-info is-fixed-top"
            role="navigation"
            aria-label="main navigation">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <a
                        className="navbar-item"
                        href='https://github.com/bananaeat/WordStore'
                        target="_blank"
                        onClick={(e) => {
                        e.preventDefault();
                        open('https://github.com/bananaeat/WordStore');
                    }}>
                        <img src="../icon.png" alt="猫猫词库 - 一个简单的词库管理工具" width="32" height="32"/>
                        猫猫词库
                    </a>
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            className="navbar-item"
                            onClick={(e) => {
                            e.preventDefault();
                            item.onClick();
                        }}>
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Menu;