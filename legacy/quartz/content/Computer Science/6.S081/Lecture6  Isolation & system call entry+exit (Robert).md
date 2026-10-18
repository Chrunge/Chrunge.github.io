#### Trap机制
1. 用户空间和内核空间的切换场景
	1. 程序执行系统调用
	2. 程序出现了类似page fault、运算时除以0的错误
	3. 一个设备触发了中断使得当前程序运行需要响应内核设备驱动

2. 在Trap过程中, 需要对寄存器做一些更改.

###### 寄存器种类
1. stack pointer（也叫做堆栈寄存器 stack register）
2. 在硬件中还有一个寄存器叫做程序计数器（Program Counter Register）
3. 表明当前mode的标志位，这个标志位表明了当前是supervisor mode还是user mode。当我们在运行Shell的时候，自然是在user mode。
	1. 当你在supervisor mode时，你可以：读写SATP寄存器，也就是page table的指针；STVEC，也就是处理trap的内核指令地址；SEPC，保存当发生trap时的程序计数器；SSCRATCH等等。在supervisor mode你可以读写这些寄存器，而用户代码不能做这样的操作。
	2. 另一件事情supervisor mode可以做的是，它可以使用PTE_U标志位为0的PTE。当PTE_U标志位为1的时候，表明用户代码可以使用这个页表；如果这个标志位为0，则只有supervisor mode可以使用这个页表。
	3. 这两点就是supervisor mode可以做的事情，除此之外就不能再干别的事情了。
	4. 如果一个虚拟地址并不在当前由SATP指向的page table中，又或者SATP指向的page table中PTE_U=1，那么supervisor mode不能使用那个地址
4. 还有一堆控制CPU工作方式的寄存器，比如SATP（Supervisor Address Translation and Protection）寄存器，它包含了指向page table的物理内存地址（详见4.3）。
5. 还有一些对于今天讨论非常重要的寄存器，比如STVEC（Supervisor Trap Vector Base Address Register）寄存器，它指向了内核中处理trap的指令的起始地址。
6. SEPC（Supervisor Exception Program Counter）寄存器，在trap的过程中保存程序计数器的值。
7. SSRATCH（Supervisor Scratch Register）寄存器，这也是个非常重要的寄存器（详见6.5）。SCRATCH寄存器的作用就是保存另一个寄存器的值，并将自己的值加载给另一个寄存器.


#### Trap执行力流程
1. ![](Pasted%20image%2020220829194120.png)
2. ![](Pasted%20image%2020220829200130.png)
3. ecall并不会切换page table，这是ecall指令的一个非常重要的特点。所以这意味着，trap处理代码必须存在于每一个user page table中。而这个trampoline page，是由内核小心的映射到每一个user page table中，以使得当我们仍然在使用user page table时，内核在一个地方能够执行trap机制的最开始的一些指令。
	1. ecall将代码从user mode改到supervisor mode
	2. ecall将程序计数器的值保存在了SEPC寄存器
	3. ecall会跳转到STVEC寄存器指向的指令
4. 保存用户进程的寄存器: uservec函数
	1. 一个部分是，XV6在每个user page table映射了trapframe page，这样每个进程都有自己的trapframe page。这个page包含了很多有趣的数据，但是现在最重要的数据是用来保存用户寄存器的32个空槽位。所以，在trap处理代码中，现在的好消息是，我们在user page table有一个之前由kernel设置好的映射关系，这个映射关系指向了一个可以用来存放这个进程的用户寄存器的内存位置。这个位置的虚拟地址总是0x3ffffffe000。
	2. 另一半的答案在于我们之前提过的SSCRATCH寄存器。

> 学生提问：我想知道csrrw指令是干什么的？
> Robert教授：这条指令交换了寄存器a0和sscratch的内容。这个操作超级重要，它回答了这个问题，内核的trap代码如何能够在不使用任何寄存器的前提下做任何操作。
> 学生提问：为什么我们在gdb中看不到ecall的具体内容？或许我错过了，但是我觉得我们是直接跳到trampoline代码的。
> Robert教授：ecall只会更新CPU中的mode标志位为supervisor，并且设置程序计数器成STVEC寄存器内的值。**在进入到用户空间之前(进程初始化时)**，内核会将trampoline page的地址存在STVEC寄存器中。所以ecall的下一条指令的位置是STVEC指向的地址，也就是trampoline page的起始地址。（注，实际上ecall是CPU的指令，自然在gdb中看不到具体内容）
> 学生提问：当与a0寄存器进行交换时，trapframe的地址是怎么出现在SSCRATCH寄存器中的？
> Robert教授：在内核前一次切换回用户空间时，内核会执行set sscratch指令，将这个寄存器的内容设置为0x3fffffe000，也就是trapframe page的虚拟地址。所以，当我们在运行用户代码，比如运行Shell时，SSCRATCH保存的就是指向trapframe的地址。之后，Shell执行了ecall指令，跳转到了trampoline page，这个page中的第一条指令会交换a0和SSCRATCH寄存器的内容。所以，SSCRATCH中的值，也就是指向trapframe的指针现在存储与a0寄存器中。

5. trampoline page在user page table中的映射与kernel page table中的映射是完全一样的。

	#### UART驱动的top部分
	如何从Shell程序输出提示符“$ ”到Console
	#### UART驱动的bottom部分