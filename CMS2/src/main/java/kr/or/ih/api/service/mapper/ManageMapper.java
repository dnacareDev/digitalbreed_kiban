package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Counts;

@Mapper
public interface ManageMapper
{
	List<Counts> SelectManage();

	int UpdateUserStatus(@Param("user_username") String user_username, @Param("user_status") int user_status);
}