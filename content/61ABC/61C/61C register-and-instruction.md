---
title: Computer Architecture - register and instruction
top: false
cover: false
toc: true
mathjax: true
date: 2021-04-29 17:16:50
password:
description:
tags:
- Register
- Instruction
- CS61C
categories:
- 计算机基础
---

## Lecture7-10: RISC-V Assembly language

![Abstruction](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Instruction/Abstraction.png)

1. Basic job of a CPU: execute lots of *instructions*, and instruction set is represented by the Assembly language.
<!-- more -->
2. Operations(verbs): Instruction Set, which is specified by Instruction Set Architecture, there is RISC-V architecture.
<!-- more -->
3. Assembly operands are 32 **registers**.
   1. Registers are numbered x0 to x31, every register is 32 bits wide.
   2. x0 always hold value 0.
   3. Operations determines how register contents are treated. Unlike C or Java, registers have no type.
   4. ![RegisterInsideProcessor](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Instruction/RegistersInsideProcessor.png)

- Notes:
  - each line of assembly code contains at most 1 instruction
  - Hash (#) is used for RISC-V comments, and only one line.

### RISC-V instruction set

1. ![RVInstructionSet](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Instruction/RVInstructionSet.png)

2. `rd = register destination`, 
   `rs = register source`,
   `imm =immediate`, it has sign extended and is a constant encoded as a part of an instruction.
   `u = unsign` and has no sign bit extended,
   `lw = load word: lw x10, 12(x15)`, and offset 12 bytes(not words), below is same.
   `sw = store word: sw x10, 12(x15)`,
   `lb = load byte: lb x10, 12(x15)`,
   `sb = store byte`,
   `beq = branch equal to`,equal then go to label.
   `bne = branch not equal`,
   `bge = branch greater and equal`,
   `blt = branch less than`,
   `jal rd, Label`: jump and link
   `jalr rd, rs, imm`: jump and link register

3. Logical operations:
   `sll or slli x11, x12, 2`: equal to multiply 4.
   `srl or srl x11, x12, 2`: equal to divided by 4.
   `sra or srai x10, x10 4`: insert high-order sign bit into empty bits, operate on -25 get -2, Caution!!!
   `Not = xor with 11111111`
   ![LogicalOperation]()

4. pseudocode instructions:

   ```Assembly
    j Label = jal x0, Label
    ret = jalr ra
    mv rd rs = addi rd, rs, 0
    li rd 13 = addi rd, x0, 13
    nop = addi x0, x0, x0
    ```

Notes:
    1. Memory address are in bytes, word addresses are 4 bytes apart and **litte-endian** convention.
    2. ![PrincipleOfLocality](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Instruction/PricipleOfLocality.png)

### RISC-V Function Call

1. Six Fundamental Steps in Calling a Function:
    1. Put arguments in a place where function can access
them
    2. Transfer control to function(jal)
    3. Acquire (local) storage resources needed for function
    4. Perform desired task of the function
    5. Put return value in a place where calling code can access it and restore any registers you used; release local storage
    6. Return control to point of origin, since a function can be called from several points in a program(ret)

2. RISC-V Function Call Conventions
   - Registers faster than memory, so use them
   - **a0–a7 (x10-x17)**: eight argument registers to pass parameters and two return values (a0-a1)
   - **ra**: one return address register to return to the point of origin (x1)
   - **sp**: stack pointer(x2)
   - Also s0-s1 (x8-x9) and s2-s11 (x18-x27): saved registers (more about those later)

3. Register conventions:
    - CalleR: the calling function
      CalleE: the function being called

    - Preserved across function call
        - Caller can rely on values being **unchanged**
        - sp, gp, tp, "saved registers" s0- s11 (s0 is also fp)
    - Not preserved across function call
        - Caller **cannot rely on** values being unchanged
        - Argument/return registers a0-a7, ra, "temporary registers" t0-t6

    - Notes: During calling function, it will store `saved registers` to `stack`, and restore it before return. But for `ra`, it should store it to stack before calling function, and restore it after return.

4. ![SymbolicRegisterNames](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Instruction/SymbolicRegisterNames.png)
   ![Memory Allocation](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Instruction/MemoryAllocation.png)

## Lecture11-12: Instruction Format

1. Big Idea: Stored-Program Computer
    - Instructions are represented as bit patterns(numbers)
    - Therefore, entire programs can be stored in memory to be read or written just like data, and everything has a memory address: instructions, data words
2. **Instructions as Numbers**
    - C pointers are just memory addresses: they can point to anything in memory
    - One register keeps address of instruction being executed: "**Program Counter**" (PC)
    - One word is 32 bits, so divide instruction word into "**fields**". Each field tells processor something about instruction
    - define six basic types of instruction formats:
        - **R-format** for **register-register** arithmetic operations
        - **I-format** for **register-immediate** arithmetic operations and loads
        - **S-format** for stores
        - **B-format** for branches (minor variant of S-format)
        - **U-format** for 20-bit upper immediate instructions
        - **J-format** for jumps (minor variant of U-format)

### Instructions Format

- **opcode**: partially specifies what instruction it is
- **rs1** (Source Register #1): specifies register containing first operand
- **rs2** : specifies second register operand
- **rd** (Destination Register): specifies register which will receive result of computation

1. R-Format Instruction Layout:
    ![RFormat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/RFormat.png)
        - **funct7+funct3**: combined with opcode, these two fields describe what operation to perform

2. I-Format Layout:
    ![IFormat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/IFormat.png)
        - imm[11:0] can hold values in range [-2048~ten~ , +2047~ten~], and always sign-extended to 32-bits

        ![IFormatLoad]()
        - The value loaded from memory(base + offset) is stored in register rd

3. S-Format Layout
    ![SFormat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/Sformat.png)
        - Store needs to read two registers, rs1 for base memory address, and rs2 for data to be stored, as well immediate offset!

4. B-Format Layout
    ![Bformat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/Bformat.png)
        - **PC-Relative Addressing**: Use the immediate field as a two’s-complement offset to PC
            - Can specify ± 2<sup>10</sup> 'unit'(=halfword) addresses from the PC
            - **Notes**:
                - Extensions to RISC-V base ISA support 16-bit compressed instructions and also variable-length instructions that are **multiples of 16-bits** in length
                - To enable this, RISC-V **scales the branch offset by 2 bytes** even when there are no 16-bit instructions

5. U-Format Layout
    ![UFormat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/UFormat.png)
        - **Notes**:How to set `0xDEADBEEF`?
            `lui x10, 0xDEADB` # x10 = 0xDEADB000
            `addi x10, x10, 0xEEF` # x10 = 0xDEAD**A**EEF
            Therefor, **Pre-increment value placed in upper 20 bits**, if sign bit will be set on immediate in lower 12 bits.
            `lui x10, 0xDEADC` # x10 = 0xDEADB000
            `addi x10, x10, 0xEEF` # x10 = 0xDEAD**B**EEF

6. J-Format Layout
    ![JFormat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/JFormat.png)

      ```Assembly
        # j pseudo-instruction
        j Label = jal x0, Label # Discard return address

        # Call function within 218 instructions of PC
        jal ra, FuncName
      ```

   ![JrFormat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/JrFormat.png)

      ``` Assembly
        # ret and jr psuedo-instructions
        ret = jr ra = jalr x0, ra, 0

        # Call function at any 32-bit absolute address
        lui x1, <hi20bits>
        jalr ra, x1, <lo12bits>

        # Jump PC-relative with 32-bit offset
        auipc x1, <hi20bits>
        jalr x0, x1, <lo12bits>
      ```

7. **Summary**
   ![SummaryFormat](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/SummaryFormat.png)

## Lecture13: Compilation, Assembly, Linking, Loading

   1. Interpretation vs Translation
      - Interpreter: Directly executes a program in the source language when **efficiency is not critical**
         - Interpreter provides instruction set **independence**: run on any machine
      - Translation: translate to a lower-level language to **increase performance**</br>

       ![CRunSteps](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/CRunSteps.png)</br></br>
    2. Compiler
        - Input: High-Level Language Code (e.g., foo.c)
        - Output: Assembly Language Code (e.g., foo.s for RISC-V), may contain pseudo-instructions:`mv t1,t2 = addi t1,t2,0`</br></br>

    3. Assembler
        - Input: Assembly Language Code (includes pseudo ops) (e.g., foo.s for RISC-V)
        - Output: Object Code, information tables (true assembly only) (e.g., foo.o for RISC-V)
        - Reads and Uses Directives: Give directions to assembler, but do not produce machine instructions
        - Replace Pseudo-instructions
        - Produce Machine Language
        - Creates Object File</br>
        --- 
        - **Assembler Directives**:Give directions to assembler, but do not produce machine instructions
            - **.text**: Subsequent items put in user text segment (machine code)
            - **.data**: Subsequent items put in user data segment (source file data in binary)
            - **.globl sym**: Declares sym global and can be referenced from other files 
            - **.string str**: Store the string str in memory and null-terminate it
            - **.word w1…wn**: Store the n 32-bit quantities in successive memory words</br>

        - Produce Machine Language
            - Pseudo-instruction Replacement
            - Producing Machine Language
                - Simple Case: Arithmetic, Logical, Shifts, and so on
                - What about Branches and Jumps?
                    - PC-Relative (e.g.,** beq/bne** and **jal**)
                    - So once pseudo-instructions are replaced by real ones, we know by how many instructions to branch/jump over(two passes to solve the "Forward Reference" problem)
                - What about references to static data?
                    - `la` gets broken up into `lui` and `addi` (use `auipc/addi` for PIC)
                    - These require the full 32-bit address of the data(solve later)<br/>

        - Symbol Table: List of “items” in this file that may be used by other files
            - Labels: function calling
            - Data: anything in the `.data` section; variables which may be accessed across files

        - Relocation Table: List of “items” whose address this file needs
            - Any absolute label jumped to: `jal`, `jalr`
                - Internal
                - External (including lib files)
                - Such as the `la` instruction, E.g., for `jalr` base register
            - Any piece of data in static section
                - Such as the `la` instruction, E.g., for `lw/sw` base register
        ---
        - **Object File Format**
            - object file header: size and position of the other pieces of the object file
            - text segment: the machine code
            - data segment: binary representation of the static data in the source file
            - relocation information: identifies lines of code that need to be fixed up later
            - symbol table: list of this file’s labels and static data that can be referenced
            - debugging information
            - A standard format is ELF (except MS)</br>


    4. Linker
        - Input: Object code files, information tables (e.g., foo.o,libc.o for RISC-V)
        - Output: Executable code (e.g., a.out for RISC-V)
        - Combines several object (.o) files into a single executable ("linking")
        - Enable separate compilation of files</br>

        1. Step 1: Take text segment from each .o file and put them together
        2. Step 2: Take data segment from each .o file, put them together, and concatenate this onto end of text segments
        3. Step 3: Resolve references 
            - Go through Relocation Table; handle each entry 
            - I.e., fill in all absolute addresses
        </br>
        ![FourTypesAddress](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/InstructionFormat/FourTypesAddress.png)</br></br>

        - Static vs. Dynamically Linked Libraries</br></br>
    
    5. Loader(OS)
        - Input: Executable Code (e.g., a.out for   RISC-V)
        - Output: (program is run)

