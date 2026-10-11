def caesar_decrypt(ciphertext, key):
    result = ""

    for char in ciphertext:
        if char.isupper():
            result += chr((ord(char) - ord('A') - key) % 26 + ord('A'))
        elif char.islower():
            result += chr((ord(char) - ord('a') - key) % 26 + ord('a'))
        else:
            result += char

    return result


ciphertext = input("Enter ciphertext: ")
key = int(input("Enter shift key (number): "))

print("\nDecoded message:", caesar_decrypt(ciphertext, key))

