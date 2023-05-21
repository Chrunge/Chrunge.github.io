四个话题: Isolation, Kernel and User mode, System calls, vx6的实现

#### Isolation
1. 原因: 进程与进程之间不相互影响, 用户进程不能影响Kernel
2. 实现: 接口通过抽象硬件资源，从而使得提供强隔离性成为可能。
	1. fork将CPU抽象为进程, 实现多个应用程序之间复用一个或者多个CPU.
	2. exec抽象了内存, 它表明了应用程序不能直接访问物理内存.
	3. files基本上来说抽象了磁盘, 实现了不同用户之间和同一个用户的不同进程之间的文件强隔离。

#### Defensive
1. 操作系统需要能够应对恶意的应用程序.
2. 通过硬件来实现应用程序与操作系统之间的强隔离性
	1. 第一部分是user/kernel mode
		1. user mode只能运行普通权限指令, 如add, sub, jrc, branch
		2. kernel mode能运行特殊权限指令, 如设置page table寄存器、关闭时钟中断
		3. 在处理器里面有一个flag。在处理器的一个bit，当它为1的时候是user mode，当它为0时是kernel mode。
		4. 有一种方式能够让应用程序可以将控制权转移给内核(Entering Kernel). 在RISC-V中，有一个专门的指令用来实现这个功能，叫做ECALL。ECALL接收一个数字参数，当一个用户程序想要将程序执行的控制权转移到内核，它只需要执行ECALL指令，并传入一个数字。这里的数字参数代表了应用程序想要调用的System Call。
		5. XV6中存在一个唯一的系统调用接入点，每一次应用程序执行ECALL指令，应用程序都会通过这个接入点进入到内核中。在内核侧，有一个位于syscall.c的函数syscall，每一个从应用程序发起的系统调用都会调用到这个syscall函数，syscall函数会检查ECALL的参数，通过这个参数内核可以知道调用的系统函数, 如fork, write等.
	2. 第二部分是page table或者虚拟内存（Virtual Memory）
		1. page table将虚拟内存地址映射为物理内存地址.
		2. 每一个进程都会有自己独立的page table，每一个进程只能访问出现在自己page table中的物理内存。

#### 宏内核 vs 微内核 （Monolithic Kernel vs Micro Kernel）
1. Trusted Computing Base(TCB) = Kernel space
2. 宏内核: XV6中，所有的操作系统服务都在kernel mode.
3. 微内核: 希望在kernel mode中运行尽可能少的代码。内核只有非常少的几个模块，例如，内核通常会有一些IPC(inter-process communication)的实现或者是Message passing；非常少的虚拟内存的支持，可能只支持了page table；以及分时复用CPU的一些支持。

#### 编译运行kernel
1. vx6代码结构: 
	1. kernel: 里面包含了基本上所有的内核文件。因为XV6是一个宏内核结构，这里所有的文件会被编译成一个叫做kernel的二进制文件，然后这个二进制文件会被运行在kernle mode中。
	2. user:  这基本上是运行在user mode的程序。
	3. mkfs: 它会创建一个空的文件镜像，我们会将这个镜像存在磁盘上，这样我们就可以直接使用一个空的文件系统。
2. 编译: 
	1. 首先，Makefile（XV6目录下的文件）会读取一个C文件，例如proc.c；之后调用gcc编译器，生成一个文件叫做proc.s，这是RISC-V 汇编语言文件；之后再走到汇编解释器，生成proc.o，这是汇编语言的二进制格式。**Makefile会为所有内核文件做相同的操作**
	2. Loader会收集所有的.o文件，将它们链接在一起，并生成内核文件。![](Attachments/Pasted%20image%2020220828160038.png)
	3. Makefile还会创建kernel.asm，这里包含了内核的完整汇编语言![](Attachments/Pasted%20image%2020220828161324.png)
	4. 我们来看传给QEMU的几个参数：
		1. -kernel：这里传递的是内核文件（kernel目录下的kernel文件），这是将在QEMU中运行的程序文件。
		2. -m：这里传递的是RISC-V虚拟机将会使用的内存数量
		3. -smp：这里传递的是虚拟机可以使用的CPU核数
		4. -drive：传递的是虚拟机使用的磁盘驱动，这里传入的是fs.img文件
		5. ![](Attachments/Pasted%20image%2020220828160336.png)

#### QEMU
1. 在QEMU的主循环中，只在做一件事情：
	1. 读取4字节或者8字节的RISC-V指令。
	2. 解析RISC-V指令，并找出对应的操作码（op code）。我们之前在看kernel.asm的时候，看过一些操作码的二进制版本。通过解析，或许可以知道这是一个ADD指令，或者是一个SUB指令。
	3. 之后，在软件中执行相应的指令。

#### XV6 启动过程
1. 地址0x80000000是一个被QEMU认可的地址。也就是说如果你想使用QEMU，那么第一个指令地址必须是它。如果我们查看kernel.ld![](Attachments/Pasted%20image%2020220828163914.png)
2. XV6从entry.s开始启动，这个时候没有内存分页，没有隔离性，并且运行在M-mode（machine mode）。XV6会尽可能快的跳转到kernel mode或者说是supervisor mode。![](Attachments/Pasted%20image%2020220828164033.png)
3. userinit会创建初始进程，返回到用户空间，执行刚刚介绍的3条指令，再回到内核空间。![](Attachments/Pasted%20image%2020220828165200.png)
