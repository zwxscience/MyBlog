---
title: code check tool
time: 2022.03.13 15:56:00
layout: post
tags:
- c/c++
excerpt: a code check tool for c/c++.
---
> #### codestyle.py
``` python

  
import struct
import os
import re
# import numpy as np
import const
from log import Log
from deal_single_line import DealSingle


def read_file(name):
    fileHandler = open(file_path, "r")
    # Get list of all lines in file
    listOfLines = fileHandler.readlines()
    # Close file
    fileHandler.close()
    return listOfLines


def deal_single_line(filename, listOflines):
    line_no = 1
    ds = DealSingle()
    for line in listOflines:
        ds.check_all(filename, line_no, line.replace('\n', '').replace('\r', ''))
        line_no += 1

def str_all_index( str_, a):
    '''
    Parameters
    ----------
    str_ : string.
    a : str_中的子串

    Returns
    -------
    index_list : list

    首先输入变量2个，输出list，然后中间构造每次find的起始位置start,start每次都在找到的索引+1，后面还得有终止循环的条件

    '''
    index_list = []
    start = 0
    while True:
        x = str_.find(a, start)
        if x > -1:
            start = x + 1
            index_list.append(x)
        else:
            break
    return index_list

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    print('start prepare some info')

    file_path = 'ivopts.c'
    const.list.append(file_path)
    # init log
    log = Log()
    if os.path.exists(os.path.join(os.getcwd(), const.log_name)):  # 如果文件存在
        os.remove(os.path.join(os.getcwd(), const.log_name))
    log.info('current file:' + file_path)
    if not os.path.exists(file_path): # check path is exist,print error if not
        print('path', file_path, ' does not exist')
    else:
        listOfLines = read_file(file_path)
        deal_single_line(os.path.basename(file_path), listOfLines)
        log.info('All data is processed！')

```



> #### log.py

``` python

# coding=utf-8
import logging
import time
import os
import const


class Log:
    def __init__(self):
        self.now = time.strftime("%Y-%m-%d")
        self.logname = os.path.join(os.getcwd(), const.log_name)

    def __printconsole(self, level, message):
        #print(message)
        # 创建一个logger
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)
        # 创建一个handler，用于写入日志文件
        fh = logging.FileHandler(self.logname, 'a', encoding='utf-8')
        fh.setLevel(logging.DEBUG)
        # 再创建一个handler，用于输出到控制台
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        # 定义handler的输出格式
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        fh.setFormatter(formatter)
        ch.setFormatter(formatter)
        # 给logger添加handler
        logger.addHandler(fh)
        logger.addHandler(ch)
        # 记录一条日志
        if level == 'info':
            logger.info(message)
        elif level == 'debug':
            logger.debug(message)
        elif level == 'warning':
            logger.warning(message)
        elif level == 'error':
            logger.error(message)

        # 记录完日志移除句柄Handler
        logger.removeHandler(ch)
        logger.removeHandler(fh)

        # 关闭打开的文件
        fh.close()

    def debug(self, message):
        self.__printconsole('debug', message)

    def info(self, message):
        self.__printconsole('info', message)

    def warning(self, message):
        self.__printconsole('warning', message)

    def error(self, message):
        self.__printconsole('error', message)

```

> #### const.py

``` python

log_name = "checkstyle.log"
# fileList
list = []

#max length
max_line_length = 80

``` 

> #### deal_single_line.py

``` python

import re

from log import Log
import const


class DealSingle(object):
    def __init__(self):
        self.log = Log()
        pass

    def check_all(self,filename, line_no, line):
        self.check_max_line_length(filename, line_no, line)
        self.check_2blank_operator(filename, line_no, line)
        self.check_before_blank(filename, line_no, line)
        self.check_after_blank(filename, line_no, line)

    def check_max_line_length(self,filename, line_no, line):
        if len(line) > const.max_line_length:
            self.log.error("file %s,line %d,line length %d exceed max length."%
                           (filename, line_no, len(line)))

    # before blank ~a ( ((
    def check_before_blank(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '(')
        eqs_format1 = [' (', ')(']
        eqs_format2 = ['((']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx - 1:eqIdx + 1]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2):
                if eqstr in eqs_format2  and line[eqIdx - 2:eqIdx - 1] != ' ' :
                    self.log.error("file %s,line %d,col %d operator %s missed blank." %
                                   (filename, line_no, eqIdx + 1, eqstr))
            else:
                #
                # if not (len(re.findall(r"[a-zA-Z\"]", line[eqIdx + 1:eqIdx + 2])) > 0):
                self.log.error("file %s,line %d,len %d col %s operator %s missed blank." %
                               (filename, line_no, len(line), str(eqIdx + 1), line[eqIdx:eqIdx + 1]))

    # after blank  ,
    def check_after_blank(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, ',')
        eqs_format1 = [', ']
        eqs_format2 = []
        for eqIdx in eq_ids:
            eqstr = line[eqIdx:eqIdx + 2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2):
                if eqstr in eqs_format2:
                    self.log.error("file %s,line %d,col %d operator %s missed blank." %
                                   (filename, line_no, eqIdx + 1, eqstr))
            else:
                # line end
                if not (line[-1] == ','):
                    self.log.error("file %s,line %d,len %d col %s operator %s missed blank." %
                               (filename, line_no, len(line), str(eqIdx + 1), line[eqIdx:eqIdx + 1]))

        # 2 charater >= <=  ==  != || && += -= *= /= &= ~=
        # 1 charater + - * / % | ? = > < &
    def check_2blank_operator(self, filename, line_no, line):
        self.check_eq(filename, line_no, line)
        self.check_plus(filename, line_no, line)
        self.check_minus(filename, line_no, line)
        self.check_muliti(filename, line_no, line)
        self.check_dev(filename, line_no, line)
        self.check_perc(filename, line_no, line)
        self.check_question(filename, line_no, line)
        self.check_greater(filename, line_no, line)
        self.check_less(filename, line_no, line)
        self.check_and(filename, line_no, line)

    def str_all_index(self, str_, a):
        '''
        Parameters
        ----------
        str_ : string.
        a : str_中的子串

        Returns
        -------
        index_list : list

        首先输入变量2个，输出list，然后中间构造每次find的起始位置start,start每次都在找到的索引+1，后面还得有终止循环的条件

        '''
        index_list = []
        start = 0
        while True:
            x = str_.find(a, start)
            if x > -1:
                start = x + 1
                index_list.append(x)
            else:
                break
        return index_list

    def check_eq(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '=')
        eqs_format1 = [' = ']
        eqs_format2 = [ '>= ', '<= ', '!= ', '+= ','-= ', '*= ','/= ','&= ','~= ', '|= ', '|| ', '== ']
        eqs_format3 = [' ||', ' ==']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
                elif eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                self.log.error("file %s,line %d,col %s operator = missed blank."%
                               (filename, line_no, str(eqIdx+1)))

    def check_plus(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '+')
        eqs_format1 = [' + ']
        eqs_format2 = []
        eqs_format3 = [' +=']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                # a++
                if not (line[eqIdx-1:eqIdx] == '+' or line[eqIdx+1:eqIdx+2] == '+'):
                    self.log.error("file %s,line %d,col %s operator %s missed blank."%
                                    (filename, line_no, str(eqIdx+1), line[eqIdx:eqIdx+1]))

    # the variable with - will error identify
    def check_minus(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '-')
        eqs_format1 = [' - ']
        eqs_format2 = ['']
        eqs_format3 = [' -=']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                # a-- b->flag
                if not (line[eqIdx-1:eqIdx] == '-' or line[eqIdx+1:eqIdx+2] == '-' or line[eqIdx+1:eqIdx+2] == '>'):
                    self.log.error("file %s,line %d,col %s operator %s missed blank or a variable."%
                                    (filename, line_no, str(eqIdx+1), line[eqIdx:eqIdx+1]))

    def check_muliti(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '*')
        eqs_format1 = [' * ']
        eqs_format2 = ['']
        eqs_format3 = [' *=']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                # not /*  \*/ or pointer **a or last
                if not (line[eqIdx-1:eqIdx] == '/' or line[eqIdx+1:eqIdx+2] == '/' or line[eqIdx+1:eqIdx+2] == ' ' or
                        len(re.findall(r"[a-zA-Z>*),]", line[eqIdx+1:eqIdx+2])) > 0 or line[-1] == '*'):
                    self.log.error("file %s,line %d,len %d col %s operator %s missed blank."%
                                    (filename, line_no, len(line), str(eqIdx+1), line[eqIdx:eqIdx+1]))

    def check_dev(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '/')
        eqs_format1 = [' / ']
        eqs_format2 = ['// ']
        eqs_format3 = [' /=', ' //']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3):
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank." %
                                   (filename, line_no, eqIdx + 1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                # /* */ some this/that maybe error show
                if not (line[eqIdx-1:eqIdx] == '*' or line[eqIdx+1:eqIdx+2] == '*' or line[eqIdx+1:eqIdx+2] == ' '):
                    self.log.error("file %s,line %d,len %d col %s operator %s missed blank."%
                                    (filename, line_no, len(line), str(eqIdx+1), line[eqIdx:eqIdx+1]))

    def check_perc(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '%')
        eqs_format1 = [' % ']
        eqs_format2 = ['%% ']
        eqs_format3 = [' %=', '%% ']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                # %d,%e
                if not (len(re.findall(r"[a-zA-Z\"]", line[eqIdx + 1:eqIdx + 2])) > 0):
                    self.log.error("file %s,line %d,len %d col %s operator %s missed blank."%
                                    (filename, line_no, len(line), str(eqIdx+1), line[eqIdx:eqIdx+1]))

    def check_or(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '|')
        eqs_format1 = [' | ']
        eqs_format2 = ['|| ']
        eqs_format3 = [' |=', '|| ']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                #
                # if not (len(re.findall(r"[a-zA-Z\"]", line[eqIdx + 1:eqIdx + 2])) > 0):
                self.log.error("file %s,line %d,len %d col %s operator %s missed blank."%
                                    (filename, line_no, len(line), str(eqIdx+1), line[eqIdx:eqIdx+1]))

    def check_question(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '?')
        eqs_format1 = [' ? ']
        eqs_format2 = []
        eqs_format3 = []
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                pass
                # if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                #     self.log.error("file %s,line %d,col %d operator %s missed blank."%
                #                    (filename, line_no, eqIdx+1, eqstr))
                # if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                #     self.log.error("file %s,line %d,col %d operator %s missed blank."%
                #                    (filename, line_no, eqIdx+1, eqstr))
            else:
                #
                # if not (len(re.findall(r"[a-zA-Z\"]", line[eqIdx + 1:eqIdx + 2])) > 0):
                self.log.error("file %s,line %d,len %d col %s operator %s missed blank."%
                                    (filename, line_no, len(line), str(eqIdx+1), line[eqIdx:eqIdx+1]))

    def check_greater(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '>')
        eqs_format1 = [' > ']
        eqs_format2 = ['>> ', '->']
        eqs_format3 = [' >>', ' >=']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx-1:eqIdx+2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3) :
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank."%
                                   (filename, line_no, eqIdx+1, eqstr))
            else:
                # -> <int> cout<<
                if not (line[eqIdx - 1:eqIdx] == '-' or line[eqIdx - 1:eqIdx] == '>' or
                        len(re.findall(r"[a-zA-Z\*>]", line[eqIdx - 1:eqIdx])) > 0):
                    self.log.error("file %s,line %d,len %d col %s operator %s missed blank."%
                                    (filename, line_no, len(line), str(eqIdx+1), line[eqIdx:eqIdx+1]))

    def check_less(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '<')
        eqs_format1 = [' < ']
        eqs_format2 = ['<< ']
        eqs_format3 = [' <<', ' <=']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx - 1:eqIdx + 2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3):
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank." %
                                   (filename, line_no, eqIdx + 1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank." %
                                   (filename, line_no, eqIdx + 1, eqstr))
            else:
                # <int>
                if not (len(re.findall(r"[a-zA-Z<]", line[eqIdx + 1:eqIdx + 2])) > 0 or
                        line[eqIdx - 1:eqIdx] == '<'):
                    self.log.error("file %s,line %d,len %d col %s operator %s missed blank." %
                               (filename, line_no, len(line), str(eqIdx + 1), line[eqIdx:eqIdx + 1]))

    def check_and(self, filename, line_no, line):
        eq_ids = self.str_all_index(line, '&')
        eqs_format1 = [' & ']
        eqs_format2 = ['&& ']
        eqs_format3 = [' &&']
        for eqIdx in eq_ids:
            eqstr = line[eqIdx - 1:eqIdx + 2]
            if (eqstr in eqs_format1) or (eqstr in eqs_format2) or (eqstr in eqs_format3):
                if eqstr in eqs_format2 and line[eqIdx - 2:eqIdx - 1] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank." %
                                   (filename, line_no, eqIdx + 1, eqstr))
                if eqstr in eqs_format3 and line[eqIdx + 2:eqIdx + 3] != ' ':
                    self.log.error("file %s,line %d,col %d operator %s missed blank." %
                                   (filename, line_no, eqIdx + 1, eqstr))
            else:
                # &a,
                if not (len(re.findall(r"[a-zA-Z<]", line[eqIdx + 1:eqIdx + 2])) > 0 ):
                    self.log.error("file %s,line %d,len %d col %s operator %s missed blank." %
                               (filename, line_no, len(line), str(eqIdx + 1), line[eqIdx:eqIdx + 1]))
```


