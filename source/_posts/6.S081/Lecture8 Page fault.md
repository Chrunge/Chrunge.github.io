#### Lay page allocation
1. page fault发生时，需要的信息
	1. 出错的虚拟地址，或者是触发page fault的源，将出错的地址存放在STVAL寄存器中。
	2. 出错的原因![](Attachments/Pasted%20image%2020220830103724.png)
	3. 第三个信息是触发page fault的指令的地址

#### Zero fill on demand
![](Attachments/Pasted%20image%2020220830110128.png)
#### Copy On Write Fork
![](Attachments/Pasted%20image%2020220830112425.png)
>学生提问：我们如何发现父进程写了这部分内存地址？是与子进程相同的方法吗？
>Frans教授：是的，因为子进程的地址空间来自于父进程的地址空间的拷贝。如果我们使用了特定的虚拟地址，因为地址空间是相同的，不论是父进程还是子进程，都会有相同的处理方式。

目前在XV6中，除了trampoline page外，一个物理内存page只属于一个用户进程。trampoline page永远也不会释放，所以也不是什么大问题。
但现在有多个用户进程或者说多个地址空间都指向了相同的物理内存page，举个例子，当父进程退出时我们需要更加的小心，因为我们要判断是否能立即释放相应的物理page。
我们需要对于每一个物理内存page的引用进行计数，当我们释放虚拟page时，我们将物理内存page的引用数减1，如果引用数等于0，那么我们就能释放物理内存page。
#### Demand Page
1. 直到应用程序实际需要这些指令的时候再加载内存
2. 程序的二进制文件可能非常的巨大，将它全部从磁盘加载到内存中将会是一个代价很高的操作。又或者data区域的大小远大于常见的场景所需要的大小，我们并不一定需要将整个二进制都加载到内存中。
3. 在lazy allocation中，如果内存耗尽了该如何办？
	如果内存耗尽了，一个选择是撤回page（evict page）。比如说将部分内存page中的内容写回到文件系统再撤回page。一旦你撤回并释放了page，那么你就有了一个新的空闲的page，你可以使用这个刚刚空闲出来的page，分配给刚刚的page fault handler，再重新执行指令。
	LRU算法, access bit, dirty bit
	>学生提问：对于一个cache，我们可以认为它被修改了但是还没有回写到后端存储时是dirty的。那么对于内存page来说，怎么判断dirty？它只存在于内存中，而不存在于其他地方。那么它什么时候会变成dirty呢？
	>Frans教授：对于memory mapped files，你将一个文件映射到内存中，然后恢复它，你就会设置内存page为dirty。

Frans教授：对于memory mapped files，你将一个文件映射到内存中，然后恢复它，你就会设置内存page为dirty。
>学生提问：那是不是要定时的将Access bit恢复成0？
>Frans教授：是的，这是一个典型操作系统的行为。操作系统会扫描整个内存，这里有一些著名的算法例如clock algorithm，就是一种实现方式。操作系统定时比如每100毫秒或者每秒清除Access bit.

#### Memory Map Files
从文件描述符对应的文件的偏移量的位置开始，映射长度为len的内容到虚拟内存地址VA，同时我们需要加上一些保护，比如只读或者读写。
![](Attachments/Pasted%20image%2020220830112812.png)
假设文件内容是读写并且内核实现mmap的方式是eager方式（不过大部分系统都不会这么做），内核会从文件的offset位置开始，将数据拷贝到内存，设置好PTE指向物理内存的位置。
当完成操作之后，会有一个对应的unmap系统调用，参数是虚拟地址（VA），长度（len）。来表明应用程序已经完成了对文件的操作，在unmap时间点，我们需要将dirty block写回到文件中。我们可以很容易的找到哪些block是dirty的，因为它们在PTE中的dirty bit为1。
当然，在任何聪明的内存管理机制中，所有的这些都是以lazy的方式实现。你不会立即将文件内容拷贝到内存中，而是先记录一下这个PTE属于这个文件描述符。相应的信息通常在VMA结构体中保存，VMA全称是Virtual Memory Area。