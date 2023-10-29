import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import theme from "../../styles/theme.module.css";
import { useSession } from "next-auth/react";
import useSave from "../../hooks/useSave";

const EditBox = ({ content, id, collection, key_name }: { content: string, id: string, collection: string, key_name: string }) => {

  const [ isSaving, setIsSaving ] = useState<boolean>(false);
  const [ savingStatus, setSavingStatus ] = useState<string>("SUCCESS");
  
  const [isFocused, setIsFocused] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession();

  const { save } = useSave();

  useEffect(() => {
    if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = content;
        saveText(content);
    }
  }, [ content ]); 

  const handleTextChange = (newText: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => saveText(newText), 500);
  }

  const saveText = async (newText: string) => {
    if (!isSaving && session) {
      setIsSaving(true);
      setSavingStatus("PENDING");
      try {
        const result = await save(id, collection, key_name, newText)
        if (result.success) {
          setIsSaving(false);
          setSavingStatus("SUCCESS");
        }  else {
          setIsSaving(false);
          setSavingStatus("FAILED");
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
        boxShadow={isFocused ? "var(--focused-box-shadow)" : "var(--box-shadow)"}
        border={isFocused ? "var(--border)" : "var(--secondary-border)"}
        borderRadius={'30px'}
        _hover={{
          border: "var(--border)"
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
  const [isVisible, setIsVisible] = useState(false);

  const dotColors: {[key: string]: string} = {
    "SUCCESS": "var(--success)",
    "PENDING": "var(--warning)",
    "FAILED": "var(--error)"
  };

  const codes: {[key: string]: string} = {
    "SUCCESS": "saved",
    "PENDING": "saving...",
    "FAILED": "failed"
  };

  useEffect(() => {
    if (status === 'PENDING') {
      setIsVisible(true);
    }

    if (status === 'SUCCESS' || status === 'FAILED') {
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }
  }, [status]);

  return (
    <>
      <Box
        opacity={isVisible ? 1 : 0}
        transition="opacity .4s ease-in-out"
        w="140px"
        bgColor="var(--primary-light)"
        position="absolute"
        top="0px"
        right="0px"
        borderTopRightRadius="var(--border-radius)"
        borderBottomLeftRadius="var(--border-radius)"
        alignContent="center"
        justifyContent="center"
        display="flex"
      >
        <Box alignContent="center" justifyContent="flex-start" display="flex" py={0.5}>
          <Box
            animation={status === 'PENDING' ? 'fadeInOut 2s infinite' : ''}
            mt="5px"
            ml="40px"
            w="15px"
            h="15px"
            borderRadius="50%"
            boxShadow={`0 0 10px ${dotColors[status]}`}
            bgColor={dotColors[status]}
            border="1px solid"
            borderColor="var(--primary-white)"
          />
          <Box width="100px">
            <Text ml={3} textAlign="left">{codes[status]}</Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};