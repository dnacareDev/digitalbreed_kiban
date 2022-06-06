package kr.or.ih.api.service.mapper;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.User;

@Mapper
public interface LoginMapper
{
	User SelectUser(@Param("user_username") String user_username, @Param("user_password") String user_password);

	int CheckUsername(String user_username);

	int OldCheckUsername(@Param("user_username") String user_username, @Param("old_password") String old_password);
	
	int Join(@Param("user_username") String user_username, @Param("user_password") String user_password);

	int UpdatePassword(@Param("user_username") String user_username, @Param("user_password") String user_password);
}

