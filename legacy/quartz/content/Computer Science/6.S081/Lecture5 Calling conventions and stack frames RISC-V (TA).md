#### C, RISC-V vs x86
1. 处理器并不能理解C语言。处理器能够理解的是汇编语言，或者更具体的说，处理器能够理解的是二进制编码之后的汇编代码。
2. RISC-V中的RISC是精简指令集（Reduced Instruction Set Computer）的意思，而x86通常被称为CISC，复杂指令集（Complex Instruction Set Computer）。
3. RISC-V的特殊之处在于：它区分了Base Integer Instruction Set和Standard Extension Instruction Set。Base Integer Instruction Set包含了所有的常用指令，比如add，mult。除此之外，处理器还可以选择性的支持Standard Extension Instruction Set。

4. 在gdb中输入layout asm，可以在tui窗口看到所有的汇编指令。再输入layout reg可以看到所有的寄存器信息。
> 学生提问：.asm文件和.s文件有什么区别？
> TA：我并不是百分百确定。这两类文件都是汇编代码，.asm文件中包含大量额外的标注，而.s文件中没有。所以通常来说当你编译你的C代码，你得到的是.s文件。如果你好奇我们是如何得到.asm文件，makefile里面包含了具体的步骤。
> 学生提问：你是怎么打开多个terminal窗口的？
> TA：我是通过tmux打开的。
> TA：从最初的代码可以看出，这里的程序完全是汇编代码实现的，所以自然也没有关联的C程序。如果我将断点设置在C代码中，在命中断点之后输入layout split或者layout source，就可以看到相应的C代码了。对于gdb，也可以使用apropos指令查看帮助。

#### RISC-V寄存器
![](Pasted%20image%2020220829162219.png)
1. Caller Saved寄存器在Caller调用Callee时, Callee不会保存该寄存器的值, 所有需要Caller在事先保存.
2. Callee Saved寄存器在函数调用的时候会保存, 需要被Callee保存.

#### Stack
![](Pasted%20image%2020220829162017.png)
1. 但是有关Stack Frame有两件事情是确定的：
	- Return address总是会出现在Stack Frame的第一位
	- 指向前一个Stack Frame的指针(fp)也会出现在栈中的固定位置
2. 有关Stack Frame中有两个重要的寄存器，第一个是SP（Stack Pointer），它指向Stack的底部并代表了当前Stack Frame的位置。第二个是FP（Frame Pointer），它指向当前Stack Frame的顶部。
3. Stack Frame必须要被汇编代码创建，编译器生成了汇编代码，进而创建了Stack Frame。通常，在汇编代码中，函数的最开始你们可以看到Function prologue，之后是函数的本体，最后是Epollgue。