import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import theme from "../../styles/theme.module.css";

const EditBox = ({ content, id, collection, key_name }: { content: string, id: string, collection: string, key_name: string }) => {

  const [ isSaving, setIsSaving ] = useState<boolean>(false);
  const [ savingStatus, setSavingStatus ] = useState<string>("SUCCESS");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = content;
    }
  }, []); 

  const handleTextChange = (newText: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => saveText(newText), 500);
  }

  const saveText = async (newText: string) => {
    if (!isSaving) {
      setIsSaving(true);
      setSavingStatus("PENDING");
      try {
        const response = await fetch("/api/save", {
          method: "POST",
          body: JSON.stringify({ newData: newText, id, collection, key: key_name }),
          headers: { 'Content-Type': 'application/json' }, 
        });

        if (response.ok) {
          setIsSaving(false);
          setSavingStatus("SUCCESS");
        } 
      } catch (e) {
        console.error("Error saving edit:", e);
        setIsSaving(false);
        setSavingStatus("FAILED");
      }
    }
  }

  return (
    <>
      <Box
        position={'relative'}
      >
        <div
          ref={contentEditableRef}
          className={theme.liveTextBox}
          contentEditable={true}
          onInput={(e) => handleTextChange(e.currentTarget.innerText)}
        />
        <SaveBadge status={savingStatus} />
      </Box>
    </>
  )
};

export default EditBox;

const SaveBadge = ({ status }: { status: string }) => {

  const dotColors: { [index: string]: string } = {
    "SUCCESS": "var(--success)",
    "PENDING": "var(--warning)",
    "FAILED": "var(--error)",
  }

  const codes: { [index: string]: string } = {
    "SUCCESS": "saved",
    "PENDING": "saving...",
    "FAILED": "failed",
  }

  return (
    <>
      <Box
        w={"140px"}
        bgColor={'var(--primary-light)'}
        position="absolute"
        top="0px"
        right="0px"
        borderTopRightRadius={'var(--border-radius)'}
        borderBottomLeftRadius={'var(--border-radius)'}
        alignContent={'center'}
        justifyContent={'center'}
        display={"flex"}
      >
        <Box
          alignContent={'center'}
          justifyContent={'flex-start'}
          display={"flex"}
          py={0.5}
        >
          <Box
            animation={status === "PENDING" ? "fadeInOut 2s infinite" : ""}
            mt={"5px"}
            ml={"40px"}
            w="15px"
            h="15px"
            borderRadius="50%"
            boxShadow={`0 0 10px ${dotColors[status]}`}
            bgColor={dotColors[status]}
            border="1px solid"
            borderColor={"var(--primary-white)"}
          />
          <Box width={'100px'}>
            <Text ml={3}  textAlign={'left'}>{codes[status]}</Text>
          </Box>

        </Box>
      </Box>
    </>
  )
}
